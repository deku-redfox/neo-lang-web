"use client"

import { createLessonAction, deleteLessonAction, getLessonsAction, updateLessonAction } from "@/actions";
import Breadcrumbs from "@/components/breadcrumbs";
import Dialog from "@/components/dialog";
import IconDropdown from "@/components/icon-dropdown";
import LessonProps from "@/models/lesson";
import { Edit3, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";

export default function LessonsContentSuspense() {
	return (
		<Suspense>
			<LessonsContent />
		</Suspense>
	)
}

function LessonsContent() {
	const langId = parseInt(useSearchParams().get('lang') ?? '0')

	const [showLessonForm, setShowLessonForm] = useState<boolean>(false)
	const [currentLesson, setCurrentLesson] = useState<LessonProps | undefined>(undefined);
	const [currentLang, setCurrentLang] = useState<LanguageProps | undefined>(undefined);
	const [lessons, setLessons] = useState<LessonProps[] | undefined>(undefined);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isFormLoading, setIsFormLoading] = useState<boolean>(false);
	const [error, setError] = useState<boolean>(false);
	const [toDelete, setToDelete] = useState<LessonProps | undefined>(undefined);
	const [icon, setIcon] = useState<string | null>(null);

	useEffect(() => {
		handleFetchLessons()
	}, [])

	useEffect(() => {
		if (toDelete) {
			setShowLessonForm(false)
		}
	}, [toDelete])

	const handleFetchLessons = async () => {
		setError(false)
		setIsLoading(true)
		const result = await getLessonsAction(langId)
		setIsLoading(false)
		if (result) {
			setLessons(result[0])
			setCurrentLang(result[1])
		} else {
			setError(true)
		}
	};

	const handleDeleteLesson = async (lesson: LessonProps) => {
		const id = lesson.id
		const result = await deleteLessonAction(id)
		if (result) {
			setLessons(lessons!.filter(l => l.id !== id))
			setToDelete(undefined)
		}
	}

	const handleOnEditLesson = (lesson: LessonProps) => {
		setCurrentLesson(lesson)
		setShowLessonForm(true)
	}

	const handleCancelEditLesson = () => {
		setCurrentLesson(undefined)
		setIcon(null)
		setShowLessonForm(false)
	}

	const handleOnSubmitLesson = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setIsFormLoading(true)
		if (currentLesson) {
			const result = await updateLessonAction(currentLesson!.id, new FormData(e.currentTarget), icon ?? currentLesson.icon)
			if (result) {
				setCurrentLesson(undefined)
				setLessons(lessons!.map(l => l.id === result.id ? result : l))
			}
		} else {
			const result = await createLessonAction(langId, new FormData(e.currentTarget), icon!)
			if (result) {
				setLessons([...lessons!, result])
			}
		}
		setIcon(null)
		setShowLessonForm(false)
		setIsFormLoading(false)
	}
	return (
		<div className="p-6">
			<Dialog
				open={!!toDelete}
				title="Suppression de la langue"
				description={`Voulez-vous supprimer la Lesson ${toDelete?.title} ?`}
				onClose={() => setToDelete(undefined)}
				onConfirm={() => handleDeleteLesson(toDelete!)}
				confirmText="Supprimer"
			/>

			{/* Lesson Form Modal */}
			{showLessonForm && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
						<h3 className="text-lg font-medium text-gray-900 mb-4">Ajouter une leçon</h3>
						<form onSubmit={handleOnSubmitLesson}>
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700">Titre</label>
									<input
										type="text"
										required
										defaultValue={currentLesson?.title}
										name="title"
										className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">Description</label>
									<textarea
										required
										defaultValue={currentLesson?.description}
										name="description"
										className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
										rows={3}
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Icône</label>
									<IconDropdown value={icon ?? currentLesson?.icon} onChange={setIcon} />
								</div>
							</div>
							<div className="mt-6 flex justify-end space-x-3">
								<button
									type="button"
									onClick={handleCancelEditLesson}
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
											: currentLesson
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
						<h3 className="text-lg font-medium text-gray-900">Leçons disponibles</h3>
						<button
							onClick={() => setShowLessonForm(true)}
							className="bg-highlight text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-highlight-second flex items-center"
						>
							<Plus className="mr-2 h-4 w-4" />
							Ajouter
						</button>
					</div>
					<div className="mt-3">
						<Breadcrumbs items={[{ label: `Langues`, href: `/dashboard?view=languages` }, { label: `${currentLang?.title ?? ''}`, href: `#` }]} />
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leçon</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Icône</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{
								isLoading ? (
									<tr><td colSpan={4} className="text-center py-8">Chargement...</td></tr>
								)
									: error ? (
										<tr><td colSpan={4} className="text-red-500 text-center py-8">Une erreur est survenue <span className="text-blue-400 cursor-pointer" onClick={handleFetchLessons}>Reessayer</span></td></tr>
									)
										: lessons!.length === 0 ? (
											<tr><td colSpan={4} className="text-center py-8">Aucune Lessons n&apos;a ete cree pour l&apos;instant</td></tr>
										)
											: lessons!.map((lesson) => {
												return (
													<tr key={lesson.id}>
														<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
															<Link href={`/dashboard?view=questions&lang=${langId}&lang-name=${currentLang?.title}&lesson=${lesson.id}`} className="text-highlight-second hover:text-highlight-second/40">
																{lesson.title}
															</Link>
														</td>
														<td className="px-6 py-4 text-sm text-gray-500">{lesson.description}</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
															<Image src={lesson.icon} alt={lesson.title} width={32} height={32} />
														</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
															<div className="flex space-x-2">
																<button onClick={() => handleOnEditLesson(lesson)} className="text-highlight hover:text-blue-900">
																	<Edit3 className="h-4 w-4" />
																</button>
																<button
																	onClick={() => setToDelete(lesson)}
																	className="text-red-600 hover:text-red-900"
																>
																	<Trash2 className="h-4 w-4" />
																</button>
															</div>
														</td>
													</tr>
												);
											})
							}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}