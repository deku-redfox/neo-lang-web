import { Suspense } from 'react';
import LanguagesContent from './languages';
import LessonsContent from './lessons';
import QuestionsContent from './questions';
import UsersContent from './users';

type SearchParamsProps = {
	view: "languages" | "lessons" | "questions" | "users" | undefined,
	item: string | undefined
}

export default async function Dashboard() {
	const view  = 'languages'
	const pages = {
		languages: {title: 'Gestion des Langues', component: LanguagesContent},
		lessons: {title: 'Gestion des Lecons', component: LessonsContent},
		questions: {title: 'Gestion des Questions', component: QuestionsContent},
		users: {title: 'Gestion des Utilisateurs', component: UsersContent},
	}
	const currentPage = pages[view ?? 'languages']

	return <currentPage.component />
}