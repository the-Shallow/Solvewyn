import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge"; 
import { Table, TableBody,TableCaption,TableCell,TableFooter,TableHead,TableHeader,TableRow } from "@/components/ui/Table";
import { Select, SelectTrigger,SelectValue,SelectContent,SelectItem } from "@/components/ui/Select";
import { Pagination, PaginationContent, PaginationEllipsis,PaginationItem,PaginationLink,PaginationNext,PaginationPrevious } from "@/components/ui/Pagination";
import { Search, Clock, MemoryStick } from "lucide-react";
import { useContext } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { API_BASE_URL } from "../config";

const Problems = () => {
    const {user,loading} = useAuth();
    console.log(user)
    const [mockProblems,setMockProblems] = useState<any[]>([]);
    const [problemData,setProblemData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [difficultyFilter,setDifficultyFilter] = useState("all");
    const [languageFilter,setLanguageFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(()=> {
        const fetchProblemsBasedOnUser = async () => {
            try{
                // console.log(user[0].id);
                const res = await axios.get(`${API_BASE_URL}/submissions/${user._id}`,{withCredentials:true});
                console.log(res.data.submissions);
                if (res.status == 200 && res.data.submissions) {
                    for(let i = 0;i<res.data.submissions.length;i++){
                        const current_problem = res.data.submissions[i]
                        console.log(current_problem);
                        setMockProblems(prev => [...prev,{
                            id: current_problem.problem_id,
                            title: current_problem.problem_title,
                            difficulty: current_problem.problem_difficulty,
                            language: current_problem.language,
                            timeTaken: "3 mins",
                            memoryUsed: "15.6 MB",
                            status: "Solved"
                        }])
                    }
                }
            }catch(err){
                console.log(err);
            }
        }

        fetchProblemsBasedOnUser();
    },[user])

    const languages = [...new Set(mockProblems.map(p=>p.language))];

    const filteredProblems = mockProblems.filter(problem => {
        const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDifficulty = difficultyFilter == "all" || problem.difficulty == difficultyFilter;
        const matchesLanguage = languageFilter == "all" || problem.language == languageFilter;
        return matchesSearch && matchesDifficulty && matchesLanguage;
    })

    const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProblems = filteredProblems.slice(startIndex,startIndex+itemsPerPage);

    const getDifficultyBadgeVariant = (difficulty : string) => {
        switch (difficulty) {
            case "Easy":return "default";
            case "Medium":return "secondary";
            case "Hard":return "destructive";
            default: return "outline";
        }
    };

    const getDifficultyRowColor = (difficulty:string) => {
        switch (difficulty) {
            case "Easy":return "bg-green-50 hover:bg-green-100 dark:bg-green-950/20 dark:hover:bg-green-950/30";
            case "Medium":return "bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-950/20 dark:hover:bg-yellow-950/30";
            case "Hard":return "bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/30";
            default: return "hover:bg-muted/50";
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Problems</h1>
                    <p className="text-muted-foreground">Track your coding progress and solutions</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Solved Problems</CardTitle>
                        <div className="flex flex-col md:flex-row gap-4 mt-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input 
                                    placeholder="Search Problems..."
                                    value={searchTerm}
                                    onChange={(e)=> setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                                <SelectTrigger className="w-full md:w-40">
                                    <SelectValue placeholder="Difficulty" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="all">All Difficulties</SelectItem>
                                    <SelectItem value="Easy">Easy</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="Hard">Hard</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={languageFilter} onValueChange={setLanguageFilter}>
                                <SelectTrigger className="w-full md:w-40">
                                    <SelectValue placeholder="Language" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="all">All Languages</SelectItem>
                                    {languages.map(lang => (
                                        <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>


                    <CardContent>
                        <div className="md:hidden space-y-4">
                            {paginatedProblems.map((problem)=> (
                                <Link key={problem.id} to={`/submission/${problem.id}`}>
                                    <Card className={`transition-colors cursor-pointer ${getDifficultyRowColor(problem.difficulty)}`}>
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-medium truncate pr-2">{problem.title}</h3>
                                                <Badge variant={getDifficultyBadgeVariant(problem.difficulty)}>
                                                    {problem.difficulty}
                                                </Badge>
                                            </div>

                                            <div className="text-sm text-muted-foreground space-y-1">
                                                <p>Language : {problem.language}</p>
                                                <div className="flex items-center gap-4">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3"/>
                                                        {problem.timeTaken}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MemoryStick className="h-3 w-3"/>
                                                        {problem.memoryUsed}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>


                        <div className="hidden md:block">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Problem Title</TableHead>
                                        <TableHead>Difficulty</TableHead>
                                        <TableHead>Language</TableHead>
                                        <TableHead>Time Taken</TableHead>
                                        <TableHead>Memory Used</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {paginatedProblems.map((problem)=> (
                                        <TableRow
                                            key={problem.id}
                                            className={`cursor-pointer transition-colors ${getDifficultyRowColor(problem.difficulty)}`}
                                            onClick={()=>window.location.href = `/submission/${problem.id}`}
                                        >
                                            <TableCell className="font-medium">{problem.title}</TableCell>
                                            <TableCell>
                                                <Badge variant={getDifficultyBadgeVariant(problem.difficulty)}>
                                                    {problem.difficulty}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{problem.language}</TableCell>
                                            <TableCell>{problem.timeTaken}</TableCell>
                                            <TableCell>{problem.memoryUsed}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {
                            totalPages > 1 && 
                            (
                                <div className="mt-6">
                                    <Pagination>
                                        <PaginationContent>
                                            <PaginationItem>
                                                    <PaginationPrevious 
                                                        onClick={()=>setCurrentPage(Math.max(1,currentPage - 1))}
                                                        className={currentPage === 1 ? "pointer-events-none opacity-50":"cursor-pointer"}
                                                    />
                                            </PaginationItem>
                                            {Array.from({length:totalPages},(_,i)=>i+1).map((page)=>(
                                                <PaginationItem key={page}>
                                                    <PaginationLink
                                                        onClick={()=>setCurrentPage(page)}
                                                        isActive={currentPage == page}
                                                        className="cursor-pointer"
                                                    >
                                                        {page}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            ))}
                                            <PaginationItem>
                                                <PaginationNext
                                                    onClick={()=>setCurrentPage(Math.min(totalPages,currentPage + 1))}
                                                    className={currentPage == totalPages ? "pointer-events-none opacity-50": "cursor-pointer"}
                                                />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            )
                        }

                        {filteredProblems.length == 0 && (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">No problem found matching your criteria.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Problems;