from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import requests
from concurrent.futures import ThreadPoolExecutor
from warnings import filterwarnings
import io
import sys
import os
from typing import Dict, List, Any, Optional

# Load environment variables
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Configure environment variables
os.environ["LANGSMITH_TRACING"] = os.getenv("LANGSMITH_TRACING", "true")
if "LANGSMITH_API_KEY" not in os.environ:
    os.environ["LANGSMITH_API_KEY"] = os.getenv("LANGSMITH_API_KEY", "")
if "LANGSMITH_PROJECT" not in os.environ:
    os.environ["LANGSMITH_PROJECT"] = os.getenv("LANGSMITH_PROJECT", "leetcode_scraper")
if not os.environ.get("GOOGLE_API_KEY"):
    os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY", "")

filterwarnings('ignore')

app = FastAPI(title="LeetCode Profile Analyzer", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with specific frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    username: str

class LeetcodeScraper:
    def __init__(self):
        self.base_url = 'https://leetcode.com/graphql'
        self.operation_queries = {
            'userPublicProfile': '''
                query userPublicProfile($username: String!) {
                    matchedUser(username: $username) {
                        contestBadge {
                            name
                            expired
                            hoverText
                            icon
                        }
                        username
                        profile {
                            ranking
                            userAvatar
                            realName
                            aboutMe
                            school
                            websites
                            countryName
                            company
                            jobTitle
                            skillTags
                            postViewCount
                            postViewCountDiff
                            reputation
                            reputationDiff
                            solutionCount
                            solutionCountDiff
                            categoryDiscussCount
                            categoryDiscussCountDiff
                        }
                    }
                }
            ''',
            'languageStats': '''
                query languageStats($username: String!) {
                    matchedUser(username: $username) {
                        languageProblemCount {
                            languageName
                            problemsSolved
                        }
                    }
                }
            ''',
            'skillStats': '''
                query skillStats($username: String!) {
                    matchedUser(username: $username) {
                        tagProblemCounts {
                            advanced {
                                tagName
                                tagSlug
                                problemsSolved
                            }
                            intermediate {
                                tagName
                                tagSlug
                                problemsSolved
                            }
                            fundamental {
                                tagName
                                tagSlug
                                problemsSolved
                            }
                        }
                    }
                }
            ''',
            'userContestRankingInfo': '''
                query userContestRankingInfo($username: String!) {
                    userContestRanking(username: $username) {
                        attendedContestsCount
                        rating
                        globalRanking
                        totalParticipants
                        topPercentage
                        badge {
                            name
                        }
                    }
                    userContestRankingHistory(username: $username) {
                        attended
                        trendDirection
                        problemsSolved
                        totalProblems
                        finishTimeInSeconds
                        rating
                        ranking
                        contest {
                            title
                            startTime
                        }
                    }
                }
            ''',
            'userProblemsSolved': '''
                query userProblemsSolved($username: String!) {
                    allQuestionsCount {
                        difficulty
                        count
                    }
                    matchedUser(username: $username) {
                        problemsSolvedBeatsStats {
                            difficulty
                            percentage
                        }
                        submitStatsGlobal {
                            acSubmissionNum {
                                difficulty
                                count
                            }
                        }
                    }
                }
            ''',
            'userBadges': '''
                query userBadges($username: String!) {
                    matchedUser(username: $username) {
                        badges {
                            id
                            name
                            shortName
                            displayName
                            icon
                            hoverText
                            medal {
                                slug
                                config {
                                    iconGif
                                    iconGifBackground
                                }
                            }
                            creationDate
                            category
                        }
                        upcomingBadges {
                            name
                            icon
                            progress
                        }
                    }
                }
            ''',
            'userProfileCalendar': '''
                query userProfileCalendar($username: String!, $year: Int) {
                    matchedUser(username: $username) {
                        userCalendar(year: $year) {
                            activeYears
                            streak
                            totalActiveDays
                            dccBadges {
                                timestamp
                                badge {
                                    name
                                    icon
                                }
                            }
                            submissionCalendar
                        }
                    }
                }
            ''',
            'recentAcSubmissions': '''
                query recentAcSubmissions($username: String!, $limit: Int!) {
                    recentAcSubmissionList(username: $username, limit: $limit) {
                        id
                        title
                        titleSlug
                        timestamp
                    }
                }
            '''
        }

    def scrape_user_profile(self, username: str) -> Dict[str, Any]:
        output = {}

        def scrape_single_operation(operation: str):
            json_data = {
                'query': self.operation_queries[operation],
                'variables': {'username': username},
                'operationName': operation,
            }

            if operation == 'recentAcSubmissions':
                json_data['variables']['limit'] = 15

            try:
                response = requests.post(self.base_url, json=json_data, timeout=10)
                response.raise_for_status()
                data = response.json()
                
                if 'errors' in data:
                    print(f'GraphQL errors for {operation}: {data["errors"]}')
                    return
                    
                output[operation] = data.get('data', {})
            except requests.exceptions.RequestException as e:
                print(f'Request error - username: {username}, operation: {operation}, error: {e}')
            except Exception as e:
                print(f'Unexpected error - username: {username}, operation: {operation}, error: {e}')

        with ThreadPoolExecutor(max_workers=len(self.operation_queries)) as executor:
            executor.map(scrape_single_operation, self.operation_queries.keys())

        return output

def deep_get(dictionary: Dict, keys: List[str], default=None):
    """Safely get nested dictionary values"""
    for key in keys:
        try:
            dictionary = dictionary[key]
        except (KeyError, TypeError):
            return default
    return dictionary

def analyze_profile_data(data: Dict[str, Any]) -> str:
    """Analyze LeetCode profile data and format it for AI processing"""
    
    # Capture output in a string buffer
    output_buffer = io.StringIO()
    
    # Badge names
    badges = deep_get(data, ['userBadges', 'matchedUser', 'badges'], [])
    badge_names = [badge['name'] for badge in badges if badge.get('name')]
    
    # Advanced tags with ≤ 2 problems solved
    advanced_tags = deep_get(data, ['skillStats', 'matchedUser', 'tagProblemCounts', 'advanced'], [])
    low_advanced = [tag for tag in advanced_tags if tag.get('problemsSolved', 0) <= 2]
    
    # Recent AC submission titles
    recent_submissions = deep_get(data, ['recentAcSubmissions', 'recentAcSubmissionList'], [])
    recent_titles = [sub['title'] for sub in recent_submissions if sub.get('title')]
    
    # Sorted fundamental tags
    fundamental_tags = deep_get(data, ['skillStats', 'matchedUser', 'tagProblemCounts', 'fundamental'], [])
    sorted_fundamentals = sorted(fundamental_tags, key=lambda x: x.get('problemsSolved', 0), reverse=True)
    
    # Problems solved by language
    lang_stats = deep_get(data, ['languageStats', 'matchedUser', 'languageProblemCount'], [])
    lang_dict = {lang['languageName']: lang['problemsSolved'] for lang in lang_stats if lang.get('languageName')}
    
    # Streak and total active days
    calendar_info = deep_get(data, ['userProfileCalendar', 'matchedUser', 'userCalendar'], {})
    streak = calendar_info.get('streak', 0)
    total_days = calendar_info.get('totalActiveDays', 0)
    
    # Problems solved by difficulty
    submission_stats = deep_get(data, ['userProblemsSolved', 'matchedUser', 'submitStatsGlobal', 'acSubmissionNum'], [])
    problems_by_difficulty = {entry['difficulty']: entry['count'] for entry in submission_stats if entry.get('difficulty')}
    
    # Contest information
    contest_info = deep_get(data, ['userContestRankingInfo', 'userContestRanking'], {})
    
    # Profile information
    profile_info = deep_get(data, ['userPublicProfile', 'matchedUser', 'profile'], {})
    
    # Format the analysis
    print("=== LEETCODE PROFILE ANALYSIS ===\n", file=output_buffer)
    
    print("👤 PROFILE OVERVIEW:", file=output_buffer)
    if profile_info:
        print(f"- Real Name: {profile_info.get('realName', 'N/A')}", file=output_buffer)
        print(f"- Company: {profile_info.get('company', 'N/A')}", file=output_buffer)
        print(f"- Ranking: {profile_info.get('ranking', 'N/A')}", file=output_buffer)
        print(f"- Reputation: {profile_info.get('reputation', 'N/A')}", file=output_buffer)
    
    print(f"\n🏆 CONTESTS:", file=output_buffer)
    if contest_info:
        print(f"- Contests Attended: {contest_info.get('attendedContestsCount', 0)}", file=output_buffer)
        print(f"- Current Rating: {contest_info.get('rating', 'N/A')}", file=output_buffer)
        print(f"- Global Ranking: {contest_info.get('globalRanking', 'N/A')}", file=output_buffer)
    
    print(f"\n📈 PROBLEMS SOLVED BY DIFFICULTY:", file=output_buffer)
    for diff, count in problems_by_difficulty.items():
        print(f"- {diff.title()}: {count}", file=output_buffer)
    
    print(f"\n💻 PROGRAMMING LANGUAGES:", file=output_buffer)
    for lang, count in sorted(lang_dict.items(), key=lambda x: x[1], reverse=True):
        print(f"- {lang}: {count} problems", file=output_buffer)
    
    print(f"\n📊 TOP FUNDAMENTAL SKILLS:", file=output_buffer)
    for tag in sorted_fundamentals[:10]:  # Top 10
        print(f"- {tag['tagName']}: {tag['problemsSolved']} problems", file=output_buffer)
    
    print(f"\n🐢 WEAK ADVANCED AREAS (≤2 problems solved):", file=output_buffer)
    for tag in low_advanced:
        print(f"- {tag['tagName']}: {tag['problemsSolved']} problems", file=output_buffer)
    
    print(f"\n🧠 RECENT ACCEPTED SUBMISSIONS:", file=output_buffer)
    for title in recent_titles[:10]:  # Latest 10
        print(f"- {title}", file=output_buffer)
    
    print(f"\n📆 ACTIVITY:", file=output_buffer)
    print(f"- Current Streak: {streak} days", file=output_buffer)
    print(f"- Total Active Days: {total_days} days", file=output_buffer)
    
    print(f"\n✅ ACHIEVEMENTS:", file=output_buffer)
    for badge_name in badge_names:
        print(f"- {badge_name}", file=output_buffer)
    
    return output_buffer.getvalue()

async def get_ai_mentoring(profile_analysis: str) -> str:
    """Get AI-powered mentoring suggestions"""
    try:
        from langchain_google_genai import ChatGoogleGenerativeAI
        from langchain_core.messages import HumanMessage, SystemMessage
        
        # Initialize the model with proper configuration
        model = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash-exp",
            google_api_key=os.environ.get("GOOGLE_API_KEY"),
            temperature=0.7,
            convert_system_message_to_human=True  # This fixes the "Unknown field for Part: thought" error
        )
        
        system_message = SystemMessage(content="""You are a professional mentor for CS students specializing in Data Structures and Algorithms (DSA). 

Analyze the provided LeetCode profile data and give personalized, actionable advice on how to improve. Focus on:
1. Identifying strengths and weaknesses based on the data
2. Suggesting specific areas to focus on
3. Recommending a concrete study plan
4. Contest preparation tips
5. Career development advice based on their progress

Be encouraging but honest about areas that need improvement. Provide specific, actionable steps with timelines.""")
        
        human_message = HumanMessage(content=f"Please analyze this LeetCode profile and provide mentoring advice:\n\n{profile_analysis}")
        
        messages = [system_message, human_message]
        response = model.invoke(messages)
        
        return response.content
        
    except Exception as e:
        print(f"AI mentoring error: {str(e)}")
        # Fallback to manual analysis if AI fails
        return generate_manual_mentoring(profile_analysis)

def generate_manual_mentoring(profile_analysis: str) -> str:
    """Generate manual mentoring suggestions based on profile analysis"""
    import re
    
    # Extract metrics from profile_analysis text
    def extract_value(pattern, text, default="N/A"):
        match = re.search(pattern, text, re.IGNORECASE)
        return match.group(1).strip() if match else default
    
    # Parse metrics
    total_problems = extract_value(r"All:\s*(\d+)", profile_analysis, "0")
    easy = extract_value(r"Easy:\s*(\d+)", profile_analysis, "0")
    medium = extract_value(r"Medium:\s*(\d+)", profile_analysis, "0")
    hard = extract_value(r"Hard:\s*(\d+)", profile_analysis, "0")
    streak = extract_value(r"Current Streak:\s*(\d+)", profile_analysis, "0")
    contests = extract_value(r"Contests Attended:\s*(\d+)", profile_analysis, "0")
    rating = extract_value(r"Current Rating:\s*([\d.]+)", profile_analysis, "N/A")
    
    # Extract top language
    lang_match = re.search(r"PROGRAMMING LANGUAGES:(.+?)(?=\n\n|📊|$)", profile_analysis, re.DOTALL)
    top_lang = "Python/C++" if not lang_match else extract_value(r"-\s*(\w+):", lang_match.group(1), "Python/C++")
    
    # Extract top skills
    skills_match = re.search(r"TOP FUNDAMENTAL SKILLS:(.+?)(?=\n\n|🐢|$)", profile_analysis, re.DOTALL)
    top_skills = []
    if skills_match:
        skill_lines = skills_match.group(1).strip().split('\n')[:3]
        for line in skill_lines:
            skill = re.search(r"-\s*([^:]+):", line)
            if skill:
                top_skills.append(skill.group(1).strip())
    
    # Build dynamic mentoring
    mentoring_suggestions = f"""
🎯 PERSONALIZED DSA MENTORING SUGGESTIONS

Based on your LeetCode profile analysis, here are my recommendations:

📊 STRENGTHS IDENTIFIED:
✅ Solid foundation with {total_problems} problems solved
✅ Strong fundamentals: {', '.join(top_skills) if top_skills else 'Core data structures'}
✅ Good problem variety: {easy} easy, {medium} medium, {hard} hard
✅ Consistent practice with {streak}-day current streak
✅ Primary language: {top_lang}

🎯 AREAS FOR IMPROVEMENT:

1. ADVANCED DATA STRUCTURES (Priority: HIGH)
   - Focus on Trie, Segment Tree, Binary Indexed Tree
   - These are crucial for harder problems and interviews
   - Recommended: Solve 10-15 problems in each area

2. CONTEST PARTICIPATION (Priority: HIGH)
   - {contests} contests attended - aim for weekly participation
   - Current rating ({rating}) shows potential, but needs consistency
   - Target: Participate in 2-3 contests monthly

3. HARD PROBLEMS (Priority: MEDIUM)
   - Only {hard} hard problems solved
   - Aim for 1-2 hard problems weekly
   - Focus on Dynamic Programming and Graph Theory

📚 RECOMMENDED STUDY PLAN:

WEEK 1-2: Advanced Data Structures
- Trie: 10 problems
- Study pattern: Prefix matching, Word search

WEEK 3-4: Tree Algorithms
- Segment Tree: 8 problems
- Binary Indexed Tree: 6 problems

WEEK 5-6: Contest Preparation
- Participate in 2 contests
- Practice time management
- Review contest problems after each contest

WEEK 7-8: Hard Problem Focus
- Dynamic Programming: 6 hard problems
- Graph Theory: 4 hard problems

🏆 CONTEST STRATEGY:
- Your current rating ({rating}) shows potential at your level
- Focus on solving A, B, C problems quickly
- Aim to increase rating by 200-300 points in next 3 months

💼 CAREER DEVELOPMENT:
- Your {top_lang} skills are valuable for interviews
- Consider learning system design concepts
- {total_problems} problems solved shows dedication - highlight this in interviews

🎯 IMMEDIATE ACTION ITEMS:
1. Register for this week's contest
2. Solve 2-3 advanced data structure problems this week
3. Join a study group or find a practice partner
4. Set up a regular practice schedule (1-2 hours daily)

Keep up the excellent work! Your consistent practice and strong fundamentals show great potential. Focus on the advanced topics and contest participation to reach the next level! 🚀
"""
    
    return mentoring_suggestions

@app.post("/analyze")
async def analyze_profile(request: AnalyzeRequest):
    """Analyze a LeetCode profile and provide mentoring suggestions"""
    try:
        if not request.username or not request.username.strip():
            raise HTTPException(status_code=400, detail="Username is required")
        
        username = request.username.strip()
        
        # Scrape profile data
        scraper = LeetcodeScraper()
        profile_data = scraper.scrape_user_profile(username)
        
        if not profile_data:
            raise HTTPException(status_code=404, detail="Unable to fetch profile data. Please check the username.")
        
        # Check if user exists
        user_profile = deep_get(profile_data, ['userPublicProfile', 'matchedUser'])
        if not user_profile:
            raise HTTPException(status_code=404, detail="User not found. Please check the username.")
        
        # Analyze profile data
        profile_analysis = analyze_profile_data(profile_data)
        
        # Get AI mentoring suggestions
        mentoring_response = await get_ai_mentoring(profile_analysis)
        
        return {
            "success": True,
            "username": username,
            "analysis": profile_analysis,
            "mentoring": mentoring_response
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "LeetCode Profile Analyzer API is running!"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "leetcode-analyzer"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)