import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Search, Filter, CheckCircle2, Circle } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const PROBLEMS = [
   { id: '1', title: 'Two Sum', difficulty: 'Easy', status: 'Solved', category: 'Arrays', acceptance: '49.5%' },
   { id: '2', title: 'Add Two Numbers', difficulty: 'Medium', status: 'Attempted', category: 'Linked List', acceptance: '41.2%' },
   { id: '3', title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', status: 'Todo', category: 'Hash Table', acceptance: '34.7%' },
   { id: '4', title: 'Median of Two Sorted Arrays', difficulty: 'Hard', status: 'Todo', category: 'Binary Search', acceptance: '38.1%' },
   { id: '5', title: 'Longest Palindromic Substring', difficulty: 'Medium', status: 'Solved', category: 'String', acceptance: '32.5%' },
   { id: '6', title: 'Zigzag Conversion', difficulty: 'Medium', status: 'Todo', category: 'String', acceptance: '46.2%' },
   { id: '7', title: 'Reverse Integer', difficulty: 'Medium', status: 'Todo', category: 'Math', acceptance: '28.1%' },
];

export function ProblemsListPage() {
   const navigate = useNavigate();
   const [searchTerm, setSearchTerm] = useState('');

   const getDifficultyColor = (difficulty: string) => {
      switch (difficulty.toLowerCase()) {
         case 'easy': return 'text-green-500 bg-green-500/10 border-green-500/20';
         case 'medium': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
         case 'hard': return 'text-red-500 bg-red-500/10 border-red-500/20';
         default: return '';
      }
   };

   return (
      <div className="container mx-auto py-8 px-4">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
               <h1 className="text-3xl font-bold">Problems</h1>
               <p className="text-muted-foreground mt-1">Challenge yourself with our curated list of problems.</p>
            </div>
            <div className="flex gap-2">
               <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" /> Filters
               </Button>
               <Button size="sm">Pick One</Button>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
               <Card className="border-none shadow-none bg-transparent">
                  <CardContent className="p-0">
                     {/* Search and Quick Filters */}
                     <div className="flex flex-wrap gap-4 mb-6">
                        <div className="relative flex-1 min-w-[300px]">
                           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                           <Input
                              placeholder="Search problems..."
                              className="pl-10"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                           />
                        </div>
                        <div className="flex gap-2">
                           {['Easy', 'Medium', 'Hard'].map(diff => (
                              <Button key={diff} variant="ghost" size="sm" className="rounded-full border hover:bg-muted">
                                 {diff}
                              </Button>
                           ))}
                        </div>
                     </div>

                     {/* Problems Table */}
                     <div className="overflow-x-auto rounded-lg border bg-card">
                        <table className="w-full text-sm">
                           <thead>
                              <tr className="border-b bg-muted/50 transition-colors">
                                 <th className="h-10 px-4 text-left font-medium text-muted-foreground w-12">Status</th>
                                 <th className="h-10 px-4 text-left font-medium text-muted-foreground">Title</th>
                                 <th className="h-10 px-4 text-left font-medium text-muted-foreground">Acceptance</th>
                                 <th className="h-10 px-4 text-left font-medium text-muted-foreground">Difficulty</th>
                                 <th className="h-10 px-4 text-left font-medium text-muted-foreground">Category</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y">
                              {PROBLEMS.map((problem) => (
                                 <tr
                                    key={problem.id}
                                    className="hover:bg-muted/50 cursor-pointer transition-colors"
                                    onClick={() => navigate(`/problem/${problem.id}`)}
                                 >
                                    <td className="p-4 align-middle">
                                       {problem.status === 'Solved' ? (
                                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                                       ) : problem.status === 'Attempted' ? (
                                          <Circle className="h-5 w-5 text-orange-500 fill-orange-500/20" />
                                       ) : (
                                          <Circle className="h-5 w-5 text-muted-foreground/30" />
                                       )}
                                    </td>
                                    <td className="p-4 align-middle font-medium">
                                       {problem.id}. {problem.title}
                                    </td>
                                    <td className="p-4 align-middle text-muted-foreground">
                                       {problem.acceptance}
                                    </td>
                                    <td className="p-4 align-middle">
                                       <span className={`px-2 py-1 rounded-md text-xs font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                                          {problem.difficulty}
                                       </span>
                                    </td>
                                    <td className="p-4 align-middle text-muted-foreground">
                                       {problem.category}
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </CardContent>
               </Card>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-6">
               <Card>
                  <CardContent className="pt-6">
                     <h3 className="font-bold mb-4">My Progress</h3>
                     <div className="space-y-4">
                        <div>
                           <div className="flex justify-between text-xs mb-1">
                              <span>Easy</span>
                              <span>12/450</span>
                           </div>
                           <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                              <div className="bg-green-500 h-full" style={{ width: '12%' }} />
                           </div>
                        </div>
                        <div>
                           <div className="flex justify-between text-xs mb-1">
                              <span>Medium</span>
                              <span>5/1000</span>
                           </div>
                           <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                              <div className="bg-orange-500 h-full" style={{ width: '5%' }} />
                           </div>
                        </div>
                        <div>
                           <div className="flex justify-between text-xs mb-1">
                              <span>Hard</span>
                              <span>0/600</span>
                           </div>
                           <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                              <div className="bg-red-500 h-full" style={{ width: '0%' }} />
                           </div>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
                  <CardContent className="pt-6">
                     <h3 className="font-bold text-blue-500 mb-2">Premium</h3>
                     <p className="text-xs text-muted-foreground mb-4">Get access to premium features and specialized problem sets.</p>
                     <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="sm">Subscribe</Button>
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   );
}
