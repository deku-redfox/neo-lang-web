"use server"

import { cookies } from "next/headers"
import API from "./api/api"
import UserModelProps from "./models/user"
import QuestionProps from "./models/question"
import LessonProps from "./models/lesson"

export type LoginState = {
    message: String,
    token?: String | undefined,
    isAdmin?: boolean | undefined
}

export type RegisterState = {
    message: String,
    token?: String | undefined,
}

// AUTHENTIFICATION ACTIONS
export async function loginAction(initialState: any, formData: FormData): Promise<LoginState> {
    const { email, password } = Object.fromEntries(formData)
    const req = await API.createRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    })

    try {
        const result = await API.jsonReponse(req)
        const { token, user } = result!.data
        const isAdmin = user.role === 'ADMIN'
        API.setToken(token, isAdmin, await cookies())

        return {
            message: '',
            isAdmin: isAdmin,
            token: token
        }

    } catch (error: any) {
        return { message: error.message }
    }
}

export async function registerAction(initialState: any, formData: FormData): Promise<RegisterState> {
    const { name, email, password } = Object.fromEntries(formData)
    const req = await API.createRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
    })

    try {
        const result = await API.jsonReponse(req)
        const { token } = result!.data
        API.setToken(token, false, await cookies())
        return {
            message: '',
            token: token
        }

    } catch (error: any) {
        return { message: error.message }
    }
}

export async function startAction(): Promise<boolean> {
    const req = await API.createRequest('/auth/start', {})
        
    try {
        const result = await API.jsonReponse(req)
        const { token } = result!.data
        API.setToken(token, false, await cookies())
        return true

    } catch (error: any) {
        console.log('Une erreur lors de l\'appel de start type', error.getType(), ' message ', error.message); 
        return false
    }
}

export async function logoutAction(): Promise<boolean> {
    try {
        API.deleteToken(await cookies())
        return true

    } catch (error: any) {
        console.log('Une erreur lors de la deconnexion : ', error); 
        return false
    }
}


// LANGUAGES ACTIONS
export async function getLanguagesAction(): Promise<LanguageProps[] | null> {
    const req = await API.createRequest('/langs', {cookieStore: await cookies()})

    try {
        const result = await API.jsonReponse(req)
        const { langs } = result!.data
        return langs

    } catch (error: any) {
        console.log('Erreur lors de la recuperation des langues ', error.getType(), ' message : ', error.message);
        return null
    }
}

export async function createLanguageAction(formData: FormData, icon: String): Promise<LanguageProps | null> {
    const { title, description } = Object.fromEntries(formData)
    const req = await API.createRequest('/langs', {
        method: 'POST',
        body: JSON.stringify({ title, description, icon }),
        cookieStore: await cookies()
    })

    try {
        const result = await API.jsonReponse(req)
        return result!.data

    } catch (error: any) {
        console.log(error, req);
        
        return null
    }
}

export async function updateLanguageAction(langId: number, formData: FormData, icon: string): Promise<LanguageProps | null> {
    const { title, description } = Object.fromEntries(formData)
    const req = await API.createRequest(`/langs/${langId}`, {
        method: 'PUT',
        body: JSON.stringify({ title, description, icon }),
        cookieStore: await cookies()
    })

    try {
        const result = await API.jsonReponse(req)
        return result!.data

    } catch (error: any) {
        console.log('Erreur lors de la mise à jour d\'une langue ', error.getType(), ' message : ', error.message);
        return null
    }
}

export async function deleteLanguageAction(id: number): Promise<boolean> {
    const req = await API.createRequest(`/langs/${id}`, {
        method: 'DELETE',
        cookieStore: await cookies()
    })

    try {
        await API.jsonReponse(req)
        return true;

    } catch (error: any) {
        console.log('Erreur lors de la suppression de langues ', error.getType(), ' message : ', error.message);
        return false
    }
}


// LESSONS ACTIONS
export async function getLessonsAction(langId: number): Promise<[LessonProps[], LanguageProps] | null> {
    const req = await API.createRequest(`/langs/${langId}`, {cookieStore: await cookies()})

    try {
        const result = await API.jsonReponse(req)
        const { lessons, lang } = result!.data
        return [lessons, lang]

    } catch (error: any) {
        return null
    }
}

export async function updateLessonAction(lessonId: number, formData: FormData, icon: string): Promise<LessonProps | null> {
    const { title, description  } = Object.fromEntries(formData)
    const req = await API.createRequest(`/lessons/${lessonId}`, {
        method: 'PUT',
        body: JSON.stringify({ title, description, icon }),
        cookieStore: await cookies()
    })

    try {
        const result = await API.jsonReponse(req)
        return result!.data

    } catch (error: any) {
        console.log('Erreur lors de la creation de lecons ', error.getType(), ' message : ', error.message);
        return null
    }
}

export async function createLessonAction(lang_id: number, formData: FormData, icon: string): Promise<LessonProps | null> {
    const { title, description } = Object.fromEntries(formData)
    const req = await API.createRequest(`/lessons`, {
        method: 'POST',
        body: JSON.stringify({ title, description, icon, lang_id }),
        cookieStore: await cookies()
    })

    try {
        const result = await API.jsonReponse(req)
        return result!.data

    } catch (error: any) {
        console.log('Erreur lors de la creation de lecons ', error.getType(), ' message : ', error.message);
        return null
    }
}

export async function deleteLessonAction(id: number): Promise<boolean> {
    const req = await API.createRequest(`/lessons/${id}`, {
        method: 'DELETE',
        cookieStore: await cookies()
    })

    try {
        await API.jsonReponse(req)
        return true;

    } catch (error: any) {
        console.log('Erreur lors de la suppression de lecons ', error.getType(), ' message : ', error.message);
        return false
    }
}

// QUESTIONS ACTIONS
export async function getQuestionsAction(lessonId: number): Promise<[QuestionProps[], LessonProps] | null> {
    const req = await API.createRequest(`/lessons/${lessonId}`, {cookieStore: await cookies()})

    try {
        const result = await API.jsonReponse(req)
        const { questions, lesson } = result!.data
        questions.forEach((question: QuestionProps) => {
            question.parsedContent = JSON.parse(question.content)
        })
        return [questions, lesson]

    } catch (error: any) {
        return null
    }
}

export async function createQuestionAction(lesson_id: number, formData: FormData): Promise<QuestionProps | null> {
    const {type, format, txt, media, response} = Object.fromEntries(formData)
    console.log('*********** formData', media)
    
    
    const req = await API.createRequest('/questions', {
        method: 'POST',
        body: JSON.stringify({ type, format, response, content: {txt, media}, lesson_id }),
        cookieStore: await cookies()
    })

    try {
        console.log('*********** req', req)
        
        const result = await API.jsonReponse(req)
        console.log('*********** result', result)
        
        return result!.data

    } catch (error: any) {
        console.log('Erreur lors de la creation de questions ', error.getType(), ' message : ', error.message);
        return null
    }
}

export async function updateQuestionAction(question_id: number, formData: FormData): Promise<QuestionProps | null> {
    const { title, description } = Object.fromEntries(formData)
    const req = await API.createRequest(`/questions/${question_id}`, {
        method: 'PUT',
        body: JSON.stringify({ title, description }),
        cookieStore: await cookies()
    })

    try {
        const result = await API.jsonReponse(req)
        const { question } = result!.data
        return question

    } catch (error: any) {
        console.log('Erreur lors de la creation de questions ', error.getType(), ' message : ', error.message);
        return null
    }
}

export async function deleteQuestionAction(id: number): Promise<boolean> {
    const req = await API.createRequest(`/questions/${id}`, {
        method: 'DELETE',
        cookieStore: await cookies()
    })

    try {
        await API.jsonReponse(req)
        return true;

    } catch (error: any) {
        console.log('Erreur lors de la suppression de questions ', error.getType(), ' message : ', error.message);
        return false
    }
}    

// USERS ACTIONS
export async function getUsersAction(): Promise<UserModelProps[] | null> {
    const req = await API.createRequest('/users', {cookieStore: await cookies()})

    try {
        const result = await API.jsonReponse(req)
        const { users } = result!.data
        return users

    } catch (error: any) {
        return null
    }
}