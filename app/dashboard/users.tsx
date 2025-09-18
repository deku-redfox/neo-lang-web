"use client"

import { getUsersAction } from "@/actions";
import UserModelProps from "@/models/user";
import { Calendar, Edit3, Mail, User } from "lucide-react";
import { useEffect, useState } from "react";

export default function UsersContent() {
	const [users, setUsers] = useState<UserModelProps[] | undefined>(undefined);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<boolean>(false);

	useEffect(() => {
		handleFetchUsers()
	}, [])

	const handleFetchUsers = async () => {
		setError(false)
		setIsLoading(true)
		const result = await getUsersAction()
		setIsLoading(false)
		if (result) {
			setUsers(result)
		} else {
			setError(true)
		}
	};

    return (
        <div className="p-6">
			<div className="bg-white rounded-lg shadow">
				<div className="px-6 py-4 border-b border-gray-200">
					<h3 className="text-lg font-medium text-gray-900">Utilisateurs inscrits</h3>
				</div>

				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d&apos;inscription</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{
								isLoading ? (
									<tr><td colSpan={5} className="text-center py-8">Chargement...</td></tr>
								)
								: error ? (
									<tr><td colSpan={5} className="text-red-500 text-center py-8">Une erreur est survenue <span className="text-blue-400 cursor-pointer" onClick={handleFetchUsers}>Reessayer</span></td></tr>
								)
								: users!.length === 0 ? (
									<tr><td colSpan={5} className="text-center py-8">Aucun User n&apos;a ete cree pour l&apos;instant</td></tr>
								)							
								: users!.map((user) => (
									<tr key={user.id}>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center">
												<div className="flex-shrink-0 h-10 w-10">
													<div className="h-10 w-10 rounded-full bg-highlight-second/15 flex items-center justify-center">
														<User className="h-6 w-6 text-highlight" />
													</div>
												</div>
												<div className="ml-4">
													<div className="text-sm font-medium text-gray-900">{user.name ?? 'Anonyme'}</div>
												</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center">
												<Mail className="h-4 w-4 text-gray-400 mr-2" />
												<span className="text-sm text-gray-900">{user.email ?? 'Non renseigné'}</span>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center">
												<Calendar className="h-4 w-4 text-gray-400 mr-2" />
												<span className="text-sm text-gray-900">{new Date(user.created_at).toLocaleDateString('fr-FR')}</span>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'`}>Actif</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
											<div className="flex space-x-2">
												<button className="text-highlight hover:text-blue-900">
													<Edit3 className="h-4 w-4" />
												</button>
												<button
													onClick={() => {}}
													className={`text-red-600 hover:text-red-900`}
												>
													Désactiver
												</button>
											</div>
										</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
    )
}