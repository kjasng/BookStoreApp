import { Button, Input } from "antd"
import Link from "antd/es/typography/Link"

const Header = () => {
  return <div className="h-16 bg-gradient-to-r from-amber-100 to-purple-300 flex justify-center items-center">
    <div className="flex justify-between items-center w-full px-56 py-4">
      <Link href="/" className="flex items-center gap-2">
        <span>
          <img src="/src/assets/react.svg" alt="logo" className="w-6 h-6" />
        </span>
        <span className="text-black font-mono">React with Kjas Ng</span>
      </Link>
      <Input placeholder="Search" className="w-96" />
      <Button type="primary">Account</Button>
    </div>
  </div>
}

export default Header
