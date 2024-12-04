import { createBrowserRouter, RouterProvider, Outlet } from 'react-router'
import LoginPage from '@components/pages/login/index.tsx'
import Header from '@components/Header/index.tsx'
import Footer from '@components/Footer/index.tsx'
import ContactPage from '@components/pages/contact/index.tsx'
import BookPage from '@components/pages/book/index.tsx'
import Home from '@components/Home/index.tsx'
import Register from './components/pages/register'
import { useEffect } from 'react'
import { callFetchAccount } from '@/services/api'
import { doGetAccountAction } from './redux/account/accountSlice'
import { useDispatch } from 'react-redux'


const Layout = () => {
  return (
    <div className='min-h-screen'>
      <Header />
      <Outlet/>
      <Footer />
    </div>
  )
}


export default function App() {
  const dispatch = useDispatch()
  const getAccount = async() => {
    const res = await callFetchAccount()
    if(res && res.data) {
      dispatch(doGetAccountAction(res.data))
    }
  }

  useEffect(() => {
    getAccount()
  }, [])
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      errorElement: <div>Not Found</div>,

      children: [
        {index: true, element: <Home />},
        {
          path: 'contact',
          element: <ContactPage />,
        },
        {
          path: 'book',
          element: <BookPage />,
        },
      ],
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/register',
      element: <Register />,
    },
  ])
  return (
    <>
      <RouterProvider router={router} />
      </>
  )
}
