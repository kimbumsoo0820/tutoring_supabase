import React, { useEffect, useRef, useState } from 'react'
import apiCaller from '../api/apiCaller'
import supabase from '../supabase/supabaseClient'
import Modal from '../components/Modal'
import useModal from '../hooks/useModal'
const Home = () => {
    const [postData,setPostData] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [loginUser, setLoginUser] = useState()

    const email = useRef('')
    const password = useRef('')

    const signInEmail = useRef('')
    const signInPassword = useRef('')

    const title = useRef('')
    const content = useRef('')

    const {isOpen, openModal, closeModal} = useModal()


    useEffect(()=> {
        setIsLoading(true)
        const getApiData = async() => {
            const res = await apiCaller.post.getPostData()
            if(res) {
                setPostData(res)
                setIsLoading(false)
            }
        }
        getApiData()
    },[])

    const handleSignup = async(e) => {
        e.preventDefault()
        const userEmail = email.current.value
        const userPassword = password.current.value
        const res = await apiCaller.user.signUp({userEmail, userPassword})
        if(res) {
            console.log(res)
            const id = res.user.id
            const insertUser = await apiCaller.user.setUserData({id})
            if(insertUser) {
                window.alert('회원가입이 완료되었습니다.')
                email.current.value = ''
                password.current.value = ''
            }
        }
    }

    const handleSignin = async(e) => {
        e.preventDefault()
        const userSignInEmail= signInEmail.current.value
        const userSignInPassword = signInPassword.current.value
        const res = await apiCaller.user.signIn({userSignInEmail, userSignInPassword})
        localStorage.setItem('userId',res.user.id)
    }

    const handleWrite = async(e) => {
        e.preventDefault()
        const userData = await apiCaller.user.checkSignIn()
        const id = userData.session.user.id
        const postTitle = title.current.value
        const postContent = content.current.value
        const res = await apiCaller.post.writePost({id, postTitle, postContent})
        console.log('post res =>', res)
        closeModal()
    }

    const onClickLoginCheck = async() => {
        const session = await supabase.auth.getSession();
        if(session) {
            console.log(session.data.session.user)
            const isSignIn = session.data.session.user;
            setLoginUser(isSignIn);
        }
    }
    const onChangeImage = async(e) => {
        const fileData = e.target.files[0]
        console.log(fileData)
    }

    if(isLoading) {
        return <div>Loading...</div>
    }

  return (
    <div>
        
        <div>회원가입</div>
        <form onSubmit={handleSignup}>
            <label htmlFor="email">이메일</label>
            <input type="text" id='email'  ref={email}/>
            <label htmlFor="password" style={{marginLeft:"15px"}}>비밀번호</label>
            <input type="password" id='password'  ref={password}/>
            <button style={{marginLeft:"15px"}}>회원가입</button>
        </form>

        <div style={{marginTop: "50px"}} >로그인</div>
        <form onSubmit={handleSignin}>
            <label htmlFor="signIn_email">이메일</label>
            <input type="text" id='signIn_email' ref={signInEmail}/>
            <label htmlFor="signIn_password" style={{marginLeft:"15px"}}>비밀번호</label>
            <input type="password" id='signIn_password' ref={signInPassword}/>
            <button style={{marginLeft:"15px"}}>로그인</button>
        </form>

        <button onClick={onClickLoginCheck}>로그인 확인</button>
        <div>{loginUser?.email}</div>
        <div>{loginUser?.id}</div>

        <button style={{marginTop:"50px"}} onClick={openModal}>글작성</button>
        <Modal isOpen={isOpen} closeModal={closeModal}>
            <div >
                <h2>포스트 작성</h2>
                <form onSubmit={handleWrite}>
                    <div>
                        <div>
                            <label htmlFor="title">제목</label>
                            <input type="text" id="title" ref={title}/>
                        </div>
                        <div>
                            <label htmlFor="content">내용</label>
                            <input type='text' id='content' ref={content}/>
                        </div>
                        <div>
                            <label htmlFor="image">프로필 등록</label>
                            <input style={{marginLeft:'50px'}} type="file" id='image' name='profile' accept='image/*' onChange={onChangeImage} />
                        </div>
                        <button >작성</button>
                    </div>
                </form>
            </div>
        </Modal>
        {postData.map(({id, title, content, created_at})=>(
            <ul key={id}>
                <li>
                    <h1>{title}</h1>
                    <h2>{content}</h2>
                </li>
            </ul>
        ))}
    </div>
  )
}

export default Home