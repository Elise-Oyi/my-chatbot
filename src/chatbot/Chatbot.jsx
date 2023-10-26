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


    // --for SOCKET.IO
    useEffect(()=>{
      const newSocket = socketIoClient('http://127.0.0.1:8080')
      setSocket(newSocket)
    

      // ** this function gets called whenever the useEffect runs or unMount
      // **  or when the component is removed
      return () =>{
        newSocket.disconnect()
      }
    },[])


    //-- to listen to the server
    useEffect(()=>{
      //-- Listening for a message from the server
      // ** socket.on(<variable name>, <a call back function>)
      //** socket.emit is use to send and socket.on listens
      //** the variable name for the on and emit for a particular event must be the same
      //** newMessage arg represents what was sent from the socket.emit
      socket?.on('GREETING', (newMessage)=>{
        setMessages(messages.concat(newMessage))
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

      socket?.on('NEW_MESSAGE',(newMessage)=>{
        setMessages(messages.concat(newMessage))
      })
    },[socket,messages])


    //-- update unread messages 
     useEffect(()=>{

        if(windowIsOpen){

           setMessages( messages.map( message => ({
                ...message,
                unread: false
            })))

        }
     },[windowIsOpen])


     const unreadMessages = messages?.filter(m => m.unread)

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
                  messages={messages}/>
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


