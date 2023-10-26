import React, { useState } from 'react'
import styled from 'styled-components'

const Form = styled.div 
` display: flex;
 padding-top: 8px;
  background-color: white;
`
const NewMessageInput = styled.input 
` flex: 1;

  border-radius: 8px;
  font-size: 16px;
  padding: 10px;
  margin-right: 4px;
`

const SendButton = styled.button 
` 
  border-radius: 8px;
  font-size: 16px;
  padding: 10px;
`

function NewMessageForm({onSubmit = () =>{}}) {

    const [newMessage, setNewMessage]  = useState('')

    const submitForm = () => 
    {
      //e.preventDefault()
      onSubmit(newMessage)
      setNewMessage('')
    }

  return (
    <Form>
        <NewMessageInput
           value = {newMessage}
           onChange={(e)=>{setNewMessage(e.target.value)}}
           onKeyDown={(e)=>{
            if(e.key === "Enter"){
                submitForm()
                console.log(e.key)
            }
           }}
        />
        <SendButton
           className="chatbot-primary"
           onClick={submitForm}
        >send</SendButton>
    </Form>
  )
}

export default NewMessageForm
