import { SignUp } from '@clerk/nextjs'
import {dark} from "@clerk/themes";

export default function Page() {
  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-200 to-base-300 p-8">
  <SignUp appearance={{ baseTheme: dark }} />
</div>
  )
}