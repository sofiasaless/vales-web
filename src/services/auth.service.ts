import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/firebase";

export const AuthService = {
  async entrarComEmpresa(email: string, senha: string) {
    return await signInWithEmailAndPassword(auth, email, senha).then(async () => {
      const token = await auth.currentUser?.getIdTokenResult();
      localStorage.setItem('jwt', token.token)
    })
    .catch(err => {
      console.error('erro ao logar ', err)
    });
  },

}