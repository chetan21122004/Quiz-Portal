"use client"

import { useState, useEffect } from 'react'
import { X, CheckCircle, XCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface TestResultsProps {
  attemptId: string
  onClose: () => void
}

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: string
  Title: string
}

interface SubmittedAnswer {
  question_id: string
  answer: string
}

interface TestAttempt {
  id: string
  score: number
  submitted_test: SubmittedAnswer[]
  completed_at: string
}

export default function TestResults({ attemptId, onClose }: TestResultsProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [attempt, setAttempt] = useState<TestAttempt | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTestResults()
  }, [attemptId])

  const fetchTestResults = async () => {
    try {
      setLoading(true)
      
      // Fetch the test attempt
      const { data: attemptData, error: attemptError } = await supabase
        .from('test_attempts')
        .select('*')
        .eq('id', attemptId)
        .single()

      if (attemptError) throw attemptError

      setAttempt(attemptData)

      // Get question IDs from submitted answers
      const questionIds = attemptData.submitted_test.map((answer: SubmittedAnswer) => answer.question_id)

      // Fetch the questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .in('id', questionIds)

      if (questionsError) throw questionsError

      setQuestions(questionsData || [])
    } catch (error) {
      console.error('Error fetching test results:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSubmittedAnswer = (questionId: string) => {
    return attempt?.submitted_test.find(answer => answer.question_id === questionId)?.answer || ''
  }

  const isAnswerCorrect = (question: Question, submittedAnswer: string) => {
    return question.correctAnswer === submittedAnswer
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
          <div className="p-6 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Exam Results</h2>
            {questions.length > 0 && (
              <p className="text-gray-600">{questions[0].Title}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-all"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Score Summary */}
        {attempt && (
          <div className="p-4 bg-gray-50 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Your Score</h3>
                <p className="text-2xl font-bold text-green-600">
                  {attempt.score}/{questions.length} ({Math.round((attempt.score / questions.length) * 100)}%)
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Completed on</p>
                <p className="font-medium">
                  {new Date(attempt.completed_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Questions and Answers */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            {questions.map((question, index) => {
              const submittedAnswer = getSubmittedAnswer(question.id)
              const isCorrect = isAnswerCorrect(question, submittedAnswer)

              return (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <h4 className="font-medium text-gray-900 flex-1">
                      {question.question}
                    </h4>
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                    )}
                  </div>

                  <div className="ml-11 space-y-2">
                    {question.options.map((option, optionIndex) => {
                      const isSubmitted = submittedAnswer === option
                      const isCorrectOption = question.correctAnswer === option
                      
                      let optionClass = "p-3 rounded-md border "
                      
                      if (isCorrectOption) {
                        optionClass += "bg-green-50 border-green-200 text-green-800"
                      } else if (isSubmitted && !isCorrectOption) {
                        optionClass += "bg-red-50 border-red-200 text-red-800"
                      } else {
                        optionClass += "bg-gray-50 border-gray-200 text-gray-700"
                      }

                      return (
                        <div key={optionIndex} className={optionClass}>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {String.fromCharCode(65 + optionIndex)}.
                            </span>
                            <span>{option}</span>
                            {isCorrectOption && (
                              <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
                            )}
                            {isSubmitted && !isCorrectOption && (
                              <XCircle className="w-4 h-4 text-red-600 ml-auto" />
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
