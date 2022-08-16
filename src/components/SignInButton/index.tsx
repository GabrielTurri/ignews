import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'
import { signIn, signOut, useSession } from 'next-auth/react'

import styles from './styles.module.scss'

export function SignInButton() {
  const {data: session} = useSession();

  // Se o usuário tiver uma sessão:
  return session ? (
    <button 
      type="button"
      className={styles.signInButton}
      onClick={()=> signOut()}
      >
      <FaGithub color="#04d361" />
      {session.user.name}
      <FiX color="#737380" className={styles.closeIcon}/>
    </button>
  ) : (
    // Se o usuário estiver fora de uma sessão:
    <button 
      type="button"
      className={styles.signInButton}
      onClick={() => signIn('github')}
      >
      <FaGithub color="#eba417" />
      Sign in with Github
    </button>
  )
}