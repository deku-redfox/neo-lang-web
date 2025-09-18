"use client"

import { createLanguageAction, deleteLanguageAction, getLanguagesAction, updateLanguageAction } from "@/actions";
import Dialog from "@/components/dialog";
import FlagDropdown from "@/components/flag-dropdown";
import { Edit3, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

export default function LanguagesContent() {
	const [showLanguageForm, setShowLanguageForm] = useState<boolean>(false)
	const [currentLanguage, setCurrentLanguage] = useState<LanguageProps | undefined>(undefined);
	const [languages, setLanguages] = useState<LanguageProps[] | undefined>(undefined);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isFormLoading, setIsFormLoading] = useState<boolean>(false);
	const [error, setError] = useState<boolean>(false);
	const [toDelete, setToDelete] = useState<LanguageProps | undefined>(undefined);
	const [flag, setFlag] = useState<string | null>(null);

	useEffect(() => {
		handleFetchLanguages()
	}, [])

	useEffect(() => {
		if (toDelete) {
			setShowLanguageForm(false)
		}
	}, [toDelete])

	const handleFetchLanguages = async () => {
		setError(false)
		setIsLoading(true)
		const result = await getLanguagesAction()
		setIsLoading(false)
		if (result) {
			setLanguages(result)
		} else {
			setError(true)
		}
	};

	const handleDeleteLanguage = async (language: LanguageProps) => {
		const id = language.id
		const result = await deleteLanguageAction(id)
		if (result) {
			setToDelete(undefined)
			setLanguages(languages!.filter(l => l.id !== id))
		}
	}

	const handleOnEditLanguage = (language: LanguageProps) => {
		setCurrentLanguage(language)
		setShowLanguageForm(true)
	}

	const handleCancelEditLanguage = () => {
		setCurrentLanguage(undefined)
		setFlag(null)
		setShowLanguageForm(false)
	}

	const handleOnSubmitLanguage = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setIsFormLoading(true)
		
		if (currentLanguage) {
			const result = await updateLanguageAction(currentLanguage!.id, new FormData(e.currentTarget), flag ?? currentLanguage.icon)
			if (result) {
				setCurrentLanguage(undefined)
				setLanguages(languages!.map(l => l.id === result.id ? result : l))
			}
		} else {
			const result = await createLanguageAction(new FormData(e.currentTarget), flag!)
			if (result) {
				setLanguages([...languages!, result])
			}
		}
		setFlag(null)
		setIsFormLoading(false)
		setShowLanguageForm(false)
	}

	return (
		<div className="p-6">
			<Dialog 
				open={!!toDelete} 
				title="Suppression de la langue" 
				description={`Voulez-vous supprimer la langue ${toDelete?.title} ?`} 
				onClose={() => setToDelete(undefined)} 
				onConfirm={() => handleDeleteLanguage(toDelete!)} 
				confirmText="Supprimer"
			/>

			{/* Language Form Modal */}
			{showLanguageForm && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
						<h3 className="text-lg font-medium text-gray-900 mb-4">Ajouter une langue</h3>
						<form onSubmit={handleOnSubmitLanguage}>
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700">Titre</label>
									<input
										type="text"
										required
										defaultValue={currentLanguage?.title}
										name="title"
										className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">Description</label>
									<textarea
										required
										defaultValue={currentLanguage?.description}
										name="description"
										className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
										rows={3}
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Icône (drapeau)</label>
									<FlagDropdown value={flag ?? currentLanguage?.icon} onChange={setFlag} />
								</div>
							</div>
							<div className="mt-6 flex justify-end space-x-3">
								<button
									type="button"
									onClick={handleCancelEditLanguage}
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
											: currentLanguage
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
						<h3 className="text-lg font-medium text-gray-900">Langues disponibles</h3>
						<button
							onClick={() => setShowLanguageForm(true)}
							className="bg-highlight text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-highlight-second flex items-center"
						>
							<Plus className="mr-2 h-4 w-4" />
							Ajouter
						</button>
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Langue</th>
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
									<tr><td colSpan={4} className="text-red-500 text-center py-8">Une erreur est survenue <span className="text-blue-400 cursor-pointer" onClick={handleFetchLanguages}>Reessayer</span></td></tr>
								)
								: languages!.length === 0 ? (
									<tr><td colSpan={4} className="text-center py-8">Aucune Langue n'a ete cree pour l'instant</td></tr>
								)
								: languages!.map((language) => (
									<tr key={language.id}>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
											<Link href={`/dashboard?view=lessons&lang=${language.id}`} className="text-highlight-second hover:text-highlight-second/40">
												{language.title}
											</Link>
										</td>
										<td className="px-6 py-4 text-sm text-gray-500">{language.description}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											<Image src={language.icon} alt={language.title} width={32} height={32} />
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
											<div className="flex space-x-2">
												<button className="text-highlight hover:text-blue-900">
													<Edit3 onClick={() => handleOnEditLanguage(language)} className="h-4 w-4" />
												</button>
												<button onClick={() => setToDelete(language)} className="text-red-600 hover:text-red-900">
													<Trash2 className="h-4 w-4" />
												</button>
											</div>
										</td>
									</tr>
								))
							}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}