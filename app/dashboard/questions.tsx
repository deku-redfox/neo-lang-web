"use client"

import { createQuestionAction, deleteQuestionAction, getQuestionsAction, updateQuestionAction } from "@/actions";
import Breadcrumbs from "@/components/breadcrumbs";
import Dialog from "@/components/dialog";
import LessonProps from "@/models/lesson";
import QuestionProps from "@/models/question";
import { Edit3, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function QuestionsContent() {
	const langId = parseInt(useSearchParams().get('lang') ?? '0')
	const langName = useSearchParams().get('lang-name') ?? ''
	const lessonId = parseInt(useSearchParams().get('lesson') ?? '0')

	const [showQuestionForm, setShowQuestionForm] = useState<boolean>(false)
	const [currentQuestion, setCurrentQuestion] = useState<QuestionProps | undefined>(undefined);
	const [currentLesson, setCurrentLesson] = useState<LessonProps | undefined>(undefined);
	const [questions, setQuestions] = useState<QuestionProps[] | undefined>(undefined);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isFormLoading, setIsFormLoading] = useState<boolean>(false);
	const [error, setError] = useState<boolean>(false);
	const [toDelete, setToDelete] = useState<QuestionProps | undefined>(undefined);

	useEffect(() => {
		handleFetchQuestions()
	}, [])

	useEffect(() => {
		if (toDelete) {
			setShowQuestionForm(false)
		}
	}, [toDelete])

	const handleFetchQuestions = async () => {
		setError(false)
		setIsLoading(true)
		const result = await getQuestionsAction(lessonId)
		setIsLoading(false)
		if (result) {
			setQuestions(result[0])
			setCurrentLesson(result[1])
		} else {
			setError(true)
		}
	};

	const handleDeleteQuestion = async (question: QuestionProps) => {
		const id = question.id
		const result = await deleteQuestionAction(id)
		if (result) {
			setQuestions(questions!.filter(l => l.id !== id))
			setToDelete(undefined)
		}
	}

	const handleOnEditQuestion = (lesson: QuestionProps) => {
		setCurrentQuestion(lesson)
		setShowQuestionForm(true)
	}

	const handleCancelEditQuestion = () => {
		setCurrentQuestion(undefined)
		setShowQuestionForm(false)
	}

	const handleOnSubmitQuestion = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setIsFormLoading(true)
		if (currentQuestion) {
			const result = await updateQuestionAction(currentQuestion!.id, new FormData(e.currentTarget))
			if (result) {
				setCurrentQuestion(undefined)
				setQuestions(questions!.map(l => l.id === result.id ? result : l))
			}
		} else {
			const result = await createQuestionAction(currentLesson!.id, new FormData(e.target as any))
			if (result) {
				setQuestions([...questions!, result])
			}
		}
		setShowQuestionForm(false)
		setIsFormLoading(false)
	}
	return (
		<div className="p-6">
			<Dialog
				open={!!toDelete}
				title="Suppression de la langue"
				description={`Voulez-vous supprimer la Question ${toDelete?.parsedContent.txt} ?`}
				onClose={() => setToDelete(undefined)}
				onConfirm={() => handleDeleteQuestion(toDelete!)}
				confirmText="Supprimer"
			/>
			{/* Question Form Modal */}
			{showQuestionForm && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-lg w-full max-w-lg mx-4 max-h-screen overflow-y-auto">
						<h3 className="text-lg font-medium text-gray-900 mb-4">Ajouter une question</h3>
						<form onSubmit={handleOnSubmitQuestion}>
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700">Type de question</label>
									<select
										required
										defaultValue={currentQuestion?.type}
										name="type"
										className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									>
										<option value="QCM">QCM (Question à Choix Multiple)</option>
										<option value="QRO">QRO (Question à Réponse Ouverte)</option>
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700">Question (texte)</label>
									<textarea
										required
										defaultValue={currentQuestion?.parsedContent.txt}
										name="txt"
										className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
										rows={3}
										placeholder="Tapez votre question ici..."
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700">Format</label>
									<select
										required
										defaultValue={currentQuestion?.format}
										name="format"
										className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									>
										<option value="TXT">Texte uniquement</option>
										<option value="IMG">Avec image</option>
										<option value="AUD">Avec audio</option>
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700">
										Media
									</label>
									<input
										type="file"
										name="media"
										className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
										placeholder='Choisir un fichier'
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700">Réponse correcte</label>
									<input
										type="text"
										required
										defaultValue={currentQuestion?.response}
										name="response"
										className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
										placeholder="La bonne réponse"
									/>
								</div>
							</div>

							<div className="mt-6 flex justify-end space-x-3">
								<button
									type="button"
									onClick={handleCancelEditQuestion}
									className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
								>
									Annuler
								</button>
								<button
									type="submit"
									className="px-4 py-2 bg-highlight text-white rounded-md text-sm font-medium hover:bg-highlight-second"
								>
									{
										isFormLoading
											? 'En cours de chargement...'
											: currentQuestion
												? 'Enregistrer'
												: 'Ajouter'
									}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			<div className="bg-white rounded-lg shadow">
				<div className="px-6 py-4 border-b border-gray-200">
					<div className="flex justify-between items-center">
						<h3 className="text-lg font-medium text-gray-900">Questions disponibles</h3>
						<button
							onClick={() => setShowQuestionForm(true)}
							className="bg-highlight text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-highlight-second flex items-center"
						>
							<Plus className="mr-2 h-4 w-4" />
							Ajouter
						</button>
					</div>
					<div className="mt-3">
						<Breadcrumbs items={[{ label: `Langues`, href: `/dashboard?view=languages` }, { label: `${langName}`, href: `/dashboard?view=lessons&lang=${langId}` }, { label: `${currentLesson?.title ?? ''}`, href: `#` }]} />
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Format</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Media</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Réponse</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{isLoading ? (
								<tr><td colSpan={6} className="text-center py-8">Chargement...</td></tr>
							)
								: error ? (
									<tr><td colSpan={6} className="text-red-500 text-center py-8">Une erreur est survenue <span className="text-blue-400 cursor-pointer" onClick={handleFetchQuestions}>Reessayer</span></td></tr>
								)
									: questions!.length === 0 ? (
										<tr><td colSpan={6} className="text-center py-8">Aucune Questions n'a ete cree pour l'instant</td></tr>
									)
										:

										questions!.map((question) => (
											<tr key={question.id}>
												<td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{question.parsedContent.txt}</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${question.type === 'QCM' ? 'bg-highlight-second/15 text-blue-800' : 'bg-green-100 text-green-800'
														}`}>
														{question.type}
													</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${question.format === 'TXT' ? 'bg-gray-100 text-gray-800' :
														question.format === 'IMG' ? 'bg-purple-100 text-purple-800' : 'bg-yellow-100 text-yellow-800'
														}`}>
														{question.format}
													</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													{
														question.format === 'IMG' ? (
															<Image width={40} height={40} src={question.parsedContent.media!} alt={question.parsedContent.media!} />
														) : question.format === 'AUD' ? (
															<audio controls>
																<source src={question.parsedContent.media!} type="audio/mpeg" />
															</audio>
														) : 'Aucun Media'
													}
												</td>
												<td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{question.response}</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
													<div className="flex space-x-2">
														<button onClick={() => handleOnEditQuestion(question)} className="text-highlight hover:text-blue-900">
															<Edit3 className="h-4 w-4" />
														</button>
														<button
															onClick={() => setToDelete(question)}
															className="text-red-600 hover:text-red-900"
														>
															<Trash2 className="h-4 w-4" />
														</button>
													</div>
												</td>
											</tr>
										)
										)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}