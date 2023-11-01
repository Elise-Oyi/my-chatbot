import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import socketIoClient from 'socket.io-client'
import fakeMessages from './fakeMessages'
import FloatingButton from './FloatingButton'
import MessagesList from './MessagesList'
import NewMessageForm from './NewMessageForm'

//-- CSS
const FloatingContainer = styled.div 
`position: fixed;
 bottom: 32px;
 right: 32px;    
`

const FloatingWindow = styled.div
` position: fixed;
  bottom: 80px;
  right: 0; 

  background-color: white;
  color: black;
  border-radius: 8px;
  box-shadow: 0px 5px 15px black;

  width: 350px;
  height: 600px;
  display: flex;
  flex-direction: column;

  z-index: 2;
  padding: 8px;
`

const MessagesSection = styled.div
` overflow: auto;
  padding: 8px;
  flex: 1;
`

function Chatbot() {

    const [messages, setMessages] = useState([])
    const [windowIsOpen, setWindowIsOpen] = useState(false)
    const [isTyping,setIsTyping] = useState(false)
    const [otherName, setOtherName] = useState('')

    //-- socket.io
    const [socket, setSocket] = useState(null)


    //-- to scroll to the bottom when there is a new message
    const bottomOfMessagesRef = useRef(null)
    const scrollToBottom = () =>{
        bottomOfMessagesRef.current?.scrollIntoView()
    }
    //-- scroll to the bottom
    useEffect(()=>{
        scrollToBottom()
    },[messages])


    //-- connecting to SOCKET.IO
    useEffect(()=>{ 

      const chatbotId = localStorage.getItem('chatbot-id')
      
      const newSocket = socketIoClient('http://127.0.0.1:8080',{
        query: {
          id: chatbotId,
        }
      })
      setSocket(newSocket)
    

      // ** this function gets called whenever the useEffect runs or unMount
      // **  or when the component is removed
      return () =>{
        newSocket.disconnect()
      }
    },[])


    const markMessagesAsRead = () =>{
      socket?.emit('MARK_ALL_AS_READ')
    }

    //-- to listen to the server
    useEffect(()=>{

      socket?.on('ID_ASSIGNED', (newId)=>{
        localStorage.setItem('chatbot-id', newId)
      })

      socket?.on('EXISTING_MESSAGES', (messages)=>{
        setMessages(messages)
        const lastBotMessage = messages.find(message => message.from)
        setOtherName(lastBotMessage? lastBotMessage.from : 'The agent')

      })

      //-- Listening for a message from the server
      socket?.on('GREETING', (newMessage)=>{
        setMessages(messages.concat(newMessage))
        setOtherName(newMessage.from)
      } )

      socket?.on('MESSAGE_READ', ()=>{
        setMessages(messages.map((message)=>{
          if(message.isUser){
            return{
              ...message,
              unread: false
            }}
          
            return message
          
        }))
      })

      socket?.on('IS_TYPING', ()=>{
        setIsTyping(true)
      })

      socket?.on('NEW_MESSAGE',(newMessage)=>{
        setMessages(messages.concat({
          ...newMessage,
          unread: !windowIsOpen
        }))
        setIsTyping(false)
        markMessagesAsRead()
      })

    },[socket,messages,windowIsOpen])


    //-- update unread messages 
     useEffect(()=>{

        if(windowIsOpen){

           setMessages( messages.map( message => ({
                ...message,
                unread: false
            })))
           markMessagesAsRead()
        }
     },[windowIsOpen])


     const unreadMessages = messages?.filter(m => m.unread && !m.isUser)

     //-- a function that gets called when a new message is added
     const addNewMessage = (text) => {
      const newMessage = {
        text,
        isUser: true,
        sentAt: new Date(),
        id:1,
        unread: true  
    }
        setMessages(messages.concat(newMessage))

        //-- sending a prompt to the server when a new message is added
        socket?.emit('NEW_MESSAGE',newMessage)
     }

  return (
    <FloatingContainer>
      {windowIsOpen && ( 
        <FloatingWindow>
            <MessagesSection>
                 <MessagesList
                  messages={messages}
                  botName={otherName}
                  isTyping={isTyping}
                  />
                 <div className="" ref={bottomOfMessagesRef}></div>
            </MessagesSection>
           
           <NewMessageForm onSubmit={addNewMessage}/>
        </FloatingWindow>
      )}
      <FloatingButton
          onClick={ ()=> setWindowIsOpen(!windowIsOpen)}
          unreadCount = {unreadMessages.length} 
      />
    </FloatingContainer>
  )
}

export default Chatbot


