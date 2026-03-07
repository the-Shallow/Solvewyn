import { use, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Code, Clock, MemoryStick, Brain } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader,CardTitle, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Collapsible,CollapsibleContent, CollapsibleTrigger } from "@/components/ui/Collapsible";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {oneDark} from "react-syntax-highlighter/dist/esm/styles/prism";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { htmlToText } from "html-to-text";
import { API_BASE_URL } from "../config";

type Submission = {
    id:string,
    title:string,
    description:string,
    language:string,
    code:string,
    timeComplexity:string,
    memoryComplexity:string,
    aiAnalysis:{
        Analysis:string,
        Improved_Code:string,
        Complexity_Improvements:string,
    }
}
// Mock data - in real app this would come from API
const mockProblemData = {
  title: "Two Sum",
  description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
  language: "JavaScript",
  code: `function twoSum(nums, target) {
    const numMap = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (numMap.has(complement)) {
            return [numMap.get(complement), i];
        }
        
        numMap.set(nums[i], i);
    }
    
    return [];
}`,
  memoryComplexity: "O(n)",
  timeComplexity: "O(n)",
  aiAnalysis: {
    suggestions: [
      "Your solution is optimal with O(n) time complexity using a hash map approach.",
      "Consider adding input validation for edge cases like empty arrays.",
      "The variable names are clear and descriptive - good coding practice."
    ],
    improvedCode: `function twoSum(nums, target) {
    // Input validation
    if (!nums || nums.length < 2) {
        throw new Error('Array must contain at least 2 elements');
    }
    
    const numMap = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (numMap.has(complement)) {
            return [numMap.get(complement), i];
        }
        
        numMap.set(nums[i], i);
    }
    
    // No solution found
    return [];
}`,
    explanation: "The improved version adds input validation and better error handling while maintaining the same optimal time complexity."
  }
};


const ProblemDetail = () => {
    const {id} = useParams<{id:string}>();
    const navigate = useNavigate();
    const {user,loading} = useAuth();
    const [submission, setSubmission] = useState<Submission | null>(null);
    const [showCode, setShowCode] = useState(false);
    const [showAISuggestions, setShowAISuggestions] = useState(false);
    const [aiAnalysis,setAiAnalysis] = useState<Submission["aiAnalysis"] | null>(null);
    const [aiAnalysisCache,setAiAnalysisCache] = useState<Record<string,Submission["aiAnalysis"]>>({});

    const problem = mockProblemData;
    const getLanguageForHighlighter = (language:string) => {
        const langMap : {[key:string]:string}= {
            "JavaScript":"javascript",
            "Python":"python",
            "Java":"java",
            "C++":"cpp",
            "C":"c"
        };
        return langMap[language] || "javascript";
    };

    console.log(id,user);
    console.log(aiAnalysisCache);
    useEffect(() => {
        const fetchProblem = async () => {
            console.log(user);
            const res = await axios.get(`${API_BASE_URL}/submissions/${id}/${user._id}`, {
                withCredentials:true,
            });

            console.log(res.data);
            if(res.status == 200 && res.data){
                setSubmission(res.data.submission);
                mockProblemData.title = res.data.submission[0].problem_title;
                mockProblemData.description = htmlToText(res.data.submission[0].problem_description);
                mockProblemData.language = res.data.submission[0].language;
                mockProblemData.code = res.data.submission[0].code;
            }
        }

        fetchProblem();
    }, [id,user]);

    useEffect(() => {
        if(showAISuggestions && id && !aiAnalysisCache[id]){
            const fetchAIAnalysis = async () => {
                try{
                    const res = await axios.get(`${API_BASE_URL}/submissions/ai/${id}/${user._id}`,{
                        withCredentials:true
                    });

                    console.log("AI Analysis response:")
                    const ai_response = JSON.parse(res.data.ai_response);
                    console.log(ai_response);
                    if(res.status == 200 && ai_response){
                        setAiAnalysisCache((prev)=>( {
                            ...prev,
                            [id]: {
                                Analysis: ai_response.Analysis,
                                Improved_Code: ai_response.Improved_Code,
                                Complexity_Improvements: ai_response.Complexity_Improvements,
                            }
                        }));
                    }
                }catch(err){
                    console.error("Failed to fetch AI analysis:",err);
                }
            }

            fetchAIAnalysis();
        }
    }, [showAISuggestions,id,user,aiAnalysisCache]);

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-6 max-w-4xl">
                <Button 
                    variant="ghost"
                    onClick={()=>navigate(-1)}
                    className="mb-6 gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>

                <Card className="mb-6">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4">
                            <CardTitle className="text-2xl sm:text-3xl">{problem.title}</CardTitle>
                            <Badge variant="outline" className="w-fit">
                                {problem.language}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground leading-relaxed">
                            {problem.description}
                        </p>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <Clock className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Time Complexity</p>
                                    <p className="font-semibold">{problem.timeComplexity}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                {/*  */}
                                <div>
                                    <p className="text-sm text-muted-foreground">Memory Complexity</p>
                                    <p className="font-semibold">{problem.memoryComplexity}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="mb-6">
                    <Collapsible open={showCode} onOpenChange={setShowCode}>
                        <CollapsibleTrigger asChild>
                            <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Code className="h-5 w-5" />
                                    Your Submitted Code
                                    <Badge variant="secondary" className="ml-auto">
                                        {showCode ? "Hide" : "Show"}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                            <CardContent className="pt-8">
                                <div className="rounded-lg overflow-hidden border">
                                    <SyntaxHighlighter 
                                        language={getLanguageForHighlighter(problem.language)}
                                        style={oneDark}
                                        showLineNumbers
                                        customStyle={
                                            {
                                                margin:0,
                                                fontSize:"14px",
                                                lineHeight:"1.5"
                                            }
                                        }
                                    >
                                        {problem.code}
                                    </SyntaxHighlighter>
                                </div>
                            </CardContent>
                        </CollapsibleContent>
                    </Collapsible>
                </Card>

                <Card>
                    <Collapsible open={showAISuggestions} onOpenChange={setShowAISuggestions}>
                        <CollapsibleTrigger asChild>
                            <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Brain className="h-5 w-5" />
                                    AI Analysis & Suggestions
                                    <Badge variant="secondary" className="ml-auto">
                                        {showCode ? "Hide" : "Show"}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <CardContent className="pt-0 space-y-6">
                                {id && !aiAnalysisCache[id] && (
                                    <p className="text-muted-foreground">Fetching AI suggestions....</p>
                                )}

                                {id && aiAnalysisCache[id] && (
                                    <>
                                    <div>
                                    <h4 className="font-semibold mb-3 text-primary">Suggestions</h4>
                                    <ul className="space-y-2">
                                        {
                                                <li key={1} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                    <span className="text-primary font-bold">+</span>
                                                    {aiAnalysisCache[id].Analysis}
                                                </li>
                                        }
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-3 text-primary">Improved Code</h4>
                                    <div className="rounded-lg overflow-hidden border mb-4">
                                        <SyntaxHighlighter
                                            language={getLanguageForHighlighter(problem.language)}
                                            style={oneDark}
                                            showLineNumbers
                                            customStyle={
                                                {
                                                    margin:0,
                                                    fontSize:"14px",
                                                    lineHeight:"1.5"
                                                }
                                            }
                                        >
                                            {aiAnalysisCache[id].Improved_Code}
                                        </SyntaxHighlighter>
                                    </div>
                                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                                            <strong>Explanation:</strong> {aiAnalysisCache[id].Complexity_Improvements}
                                    </p>
                                </div>
                                    </>
                                )}
                            </CardContent>
                        </CollapsibleContent>
                    </Collapsible>
                </Card>
            </div>
        </div>
    )
}

export default ProblemDetail;