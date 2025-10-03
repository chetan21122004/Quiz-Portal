"use client"


import { useState } from "react"
import { Trash2, Plus, Wand2, X } from "lucide-react"
import TestPreview from "./test-preview"
import PublishModal from './publish-modal';
import { supabase } from '@/lib/supabase/client';
import { set } from "mongoose";

export default function MCQGenerator() {


    const [testTitle, setTestTitle] = useState("")
    const [topic, setTopic] = useState("")
    const [difficulty, setDifficulty] = useState("Easy")
    const [studentClass, setStudentClass] = useState("SYBCA-A")
    const [noOfQue, setNoOfQue] = useState("5")
    const [randomizeQuestions, setRandomizeQuestions] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)


    const [mcqs, setMcqs] = useState([])
    const [loading, setLoading] = useState(false)
    const [showPreview, setShowPreview] = useState(false)
    const [isPublishing, setIsPublishing] = useState(false)

    const fetchMCQs = async () => {
        if (!testTitle || !topic) return
        setLoading(true)

        try {
            const response = await fetch("/api/generate-mcqs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic, difficulty, noOfQue, testTitle }),
            })
            const data = await response.json()
            setMcqs((pre) => [...data.mcqs, ...pre])

            console.log('====================================');
            console.log(data.mcqs);
            console.log('====================================');
        } catch (error) {
            console.error("Error fetching MCQs:", error)
        } finally {
            setLoading(false)
        }
    }

    const addQuestion = () => {
        const newQuestion = {
            id: mcqs.length + 1,
            question: "",
            options: ["", "", "", ""],
            correctAnswer: "",
        }
        setMcqs([newQuestion, ...mcqs])
    }

    const removeQuestion = (index) => {
        const updatedMcqs = [...mcqs]
        updatedMcqs.splice(index, 1)
        setMcqs(updatedMcqs)
    }

    const updateQuestion = (index, field, value) => {
        const updatedMcqs = [...mcqs]
        updatedMcqs[index][field] = value
        setMcqs(updatedMcqs)
    }

    const updateOption = (questionIndex, optionIndex, value) => {
        const updatedMcqs = [...mcqs]
        updatedMcqs[questionIndex].options[optionIndex] = value
        setMcqs(updatedMcqs)
    }

    const setCorrectAnswer = (questionIndex, option) => {
        const updatedMcqs = [...mcqs]
        updatedMcqs[questionIndex].correctAnswer = option
        setMcqs(updatedMcqs)
    }

  

    const togglePreview = () => {
        setShowPreview(!showPreview)
    }


    const PublishingOverlay = () => (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center space-y-6 max-w-md w-full mx-4">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/>
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6"/>
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 16h6"/>
                        </svg>
                    </div>
                </div>
                <div className="text-center space-y-3">
                    <h3 className="text-xl font-semibold text-gray-900">Publishing Test</h3>
                    <p className="text-gray-600">Please wait while we save your test and prepare it for your students...</p>
                </div>
                <div className="flex space-x-2 items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                </div>
            </div>
        </div>
    );

    const publishTest = async () => {
            try {
              setIsPublishing(true);
              // 1. First insert all questions
              
              const { data: questionsData, error: insertError } = await supabase
                .from('questions')
                .insert(mcqs)
                .select('id, created_at');
          
              if (insertError) {
                console.error('Question insertion error details:', insertError);
                throw new Error(`Failed to insert questions: ${insertError.message}`);
              }
          
              // 2. Check if questions were actually inserted
              if (!questionsData || questionsData.length === 0) {
                throw new Error('No questions were inserted - check your data');
              }
          
              // 3. Attempt to create test
              const { data, error } = await supabase
              .rpc('create_tests_in_batches');

            if (error) throw error;
            
            if (data) {
              alert(`Successfully created tests! `);
            } else {
              alert('No tests created - need at least 5 unused questions');
            }
            setMcqs([])
            setTestTitle("")
            setTopic("")
            setDifficulty("Easy")
            setStudentClass("SYBCA-A")
            setNoOfQue("5")
            setRandomizeQuestions(false)
            setLoading(false)
            setShowPreview(false)
            

        // setIsModalOpen(true)


            } catch (err) {
              // Proper error formatting
              const errorMessage = err instanceof Error ? err.message : JSON.stringify(err);
              console.error('Full publish error:', err);
              alert(`❌ Publish failed: ${errorMessage}`);
            } finally {
              setIsPublishing(false);
            }
          };

    const LoadingOverlay = () => (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center space-y-4">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">Generating Questions</h3>
                    <p className="text-gray-500 text-sm">Using AI to create high-quality MCQs...</p>
                </div>
                <div className="flex space-x-2 items-center mt-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading && <LoadingOverlay />}
                {isPublishing && <PublishingOverlay />}
                
                {/* Enhanced Header */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Create New Exam
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Design comprehensive exam questions and configure settings to create engaging assessments for your examinees
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Exam Configuration Card */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                            <h2 className="text-xl font-bold text-white flex items-center">
                                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Exam Configuration
                            </h2>
                            <p className="text-indigo-100 text-sm mt-1">Set up your exam details and parameters</p>
                        </div>
                        
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                <div className="col-span-1 md:col-span-2 lg:col-span-1">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                        <svg className="w-4 h-4 mr-1 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                        Exam Title
                                    </label>
                                    <input
                                        type="text"
                                        value={testTitle}
                                        onChange={(e) => setTestTitle(e.target.value)}
                                        placeholder="Enter exam title"
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm hover:shadow-md"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                        <svg className="w-4 h-4 mr-1 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        Difficulty Level
                                    </label>
                                    <select
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all appearance-none bg-white shadow-sm hover:shadow-md"
                                    >
                                        <option value="Easy">🟢 Easy</option>
                                        <option value="Medium">🟡 Medium</option>
                                        <option value="Hard">🔴 Hard</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                        <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        </svg>
                                        Examinee Class
                                    </label>
                                    <select
                                        value={studentClass}
                                        onChange={(e) => setStudentClass(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all appearance-none bg-white shadow-sm hover:shadow-md"
                                    >
                                        <option value="SYBCA-C">SYBCA-C</option>
                                        <option value="SYMCA-B">SYMCA-B</option>
                                        <option value="SYMCA-C">SYMCA-C</option>
                                        <option value="FYBCA-A">FYBCA-A</option>
                                        <option value="FYBCA-B">FYBCA-B</option>
                                        <option value="TYBCA-A">TYBCA-A</option>
                                        <option value="TYBCA-B">TYBCA-B</option>
                                        <option value="TYMCA-A">TYMCA-A</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                        <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Topic & Content
                                    </label>
                                    <textarea
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        placeholder="Enter the topic for question generation (e.g., Data Structures, Algorithms, Database Management)..."
                                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all min-h-[120px] shadow-sm hover:shadow-md resize-none"
                                    />
                                </div>

                                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                                        </svg>
                                        Question Settings
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Questions</label>
                                            <select
                                                value={noOfQue}
                                                onChange={(e) => setNoOfQue(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all appearance-none bg-white shadow-sm hover:shadow-md"
                                            >
                                                <option value="5">📝 5 Questions</option>
                                                <option value="10">📋 10 Questions</option>
                                                <option value="15">📄 15 Questions</option>
                                                <option value="20">📚 20 Questions</option>
                                            </select>
                                        </div>
                                        
                                        <div className="flex items-center">
                                            <div className="flex items-center space-x-3 bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                                                <input
                                                    type="checkbox"
                                                    id="randomize"
                                                    checked={randomizeQuestions}
                                                    onChange={(e) => setRandomizeQuestions(e.target.checked)}
                                                    className="w-5 h-5 text-indigo-500 border-gray-300 rounded focus:ring-indigo-500"
                                                />
                                                <label htmlFor="randomize" className="text-sm font-medium text-gray-700 flex items-center">
                                                    <svg className="w-4 h-4 mr-1 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                                    </svg>
                                                    Randomize Questions
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row gap-4 mt-6">
                                        <button
                                            onClick={fetchMCQs}
                                            className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105"
                                        >
                                            <Wand2 className="h-5 w-5 mr-2" />
                                            ✨ Generate Questions with AI
                                        </button>
                                        <button
                                            onClick={addQuestion}
                                            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                                        >
                                            <Plus className="h-5 w-5 mr-2" />
                                            Add Manual Question
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {mcqs.length > 0 && (
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-xl font-bold text-white flex items-center">
                                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Questions ({mcqs.length})
                                        </h2>
                                        <p className="text-emerald-100 text-sm mt-1">Review and manage your exam questions</p>
                                    </div>
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={togglePreview}
                                            className="inline-flex items-center px-4 py-2 border border-white/30 rounded-xl shadow-sm text-sm font-semibold text-white bg-white/20 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-all duration-200 backdrop-blur-sm"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            {showPreview ? "✏️ Edit Questions" : "👁️ Preview Exam"}
                                        </button>
                                        <button
                                            onClick={publishTest}
                                            className="inline-flex items-center px-6 py-2 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 transform hover:scale-105"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                            🚀 Publish Exam
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-6">

                                {showPreview ? (
                                    <div 
                                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                                        onClick={(e) => {
                                            // Only close if clicking the backdrop
                                            if (e.target === e.currentTarget) {
                                                togglePreview();
                                            }
                                        }}
                                    >
                                        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                                            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                                                <h2 className="text-2xl font-bold text-gray-900">Exam Preview</h2>
                                                <button
                                                    onClick={togglePreview}
                                                    className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-all"
                                                >
                                                    <X className="h-5 w-5" />
                                                </button>
                                            </div>
                                            <div className="p-6 overflow-y-auto">
                                                <TestPreview
                                                    testTitle={testTitle}
                                                    topic={topic}
                                                    difficulty={difficulty}
                                                    questions={mcqs}
                                                    randomizeQuestions={randomizeQuestions}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {mcqs.map((mcq, index) => (
                                            <div key={index} className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex items-center">
                                                        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                                                            {index + 1}
                                                        </div>
                                                        <h3 className="text-lg font-semibold text-gray-900">Question {index + 1}</h3>
                                                    </div>
                                                    <button
                                                        onClick={() => removeQuestion(index)}
                                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 transform hover:scale-110"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="relative">
                                                        <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Question Text</label>
                                                        <textarea
                                                            value={mcq.question}
                                                            onChange={(e) => updateQuestion(index, "question", e.target.value)}
                                                            placeholder="Enter your question here..."
                                                            className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm hover:shadow-md resize-none"
                                                            rows="3"
                                                        />
                                                    </div>
                                                    
                                                    <div className="space-y-3">
                                                        <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Answer Options</label>
                                                        {mcq.options.map((option, optionIndex) => (
                                                            <div key={optionIndex} className="flex items-center space-x-3 group">
                                                                <div className="relative">
                                                                    <input
                                                                        type="radio"
                                                                        name={`correct-${index}`}
                                                                        checked={mcq.correctAnswer === option}
                                                                        onChange={() => setCorrectAnswer(index, option)}
                                                                        className="w-5 h-5 text-emerald-500 border-gray-300 focus:ring-emerald-500 transition-all"
                                                                    />
                                                                    {mcq.correctAnswer === option && (
                                                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full flex items-center justify-center">
                                                                            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                            </svg>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 relative">
                                                                    <input
                                                                        type="text"
                                                                        value={option}
                                                                        onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                                                                        placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                                                                        className={`w-full p-3 text-sm border rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm hover:shadow-md ${
                                                                            mcq.correctAnswer === option 
                                                                                ? 'border-emerald-300 bg-emerald-50 focus:border-emerald-500' 
                                                                                : 'border-gray-300 focus:border-indigo-500'
                                                                        }`}
                                                                    />
                                                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xs font-bold text-gray-400 pointer-events-none">
                                                                        {String.fromCharCode(65 + optionIndex)}.
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

