import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/config/firebase";

export const AuthService = {
  async loginWithEnterprise(email: string, password: string) {
    return await signInWithEmailAndPassword(auth, email, password).then(async () => {
      const token = await auth.currentUser?.getIdTokenResult();
      localStorage.setItem('jwt', token.token)
    })
    .catch(err => {
      console.error('erro ao logar ', err)
      throw new Error(err);
    });
  },

  async logout() {
    await auth.signOut();
    localStorage.clear()
  },

  async getCurrentEnterprise() {
    return auth.currentUser
  }

}