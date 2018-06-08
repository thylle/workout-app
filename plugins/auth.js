import { Auth } from '@/services/firebase-service.js'

export default async (context) => {
  const { store, route, redirect } = context

  return new Promise((resolve, reject) => {
    Auth.onAuthStateChanged(user => { 
      store.commit('setUser', user)            
      resolve()

      //TODO add error on login
    });
  })
}
