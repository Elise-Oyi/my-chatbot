import React from 'react'
import styled from 'styled-components'

const Container = styled.div
` text-align: left;
  display: flex;
  flex-direction: column;
`
const MessageWrapBase = styled.div
` flex-direction: column;
  display: flex;
  padding: 8px;
`
const UserMessageWrap = styled(MessageWrapBase)
` align-items: flex-end;
`
const NonUserMessageWrap = styled(MessageWrapBase)
` align-items: flex-start;
`

const MessageBase = styled.span
` padding: 8px;
  border-radius: 8px;
  max-width: 75%;
`

const UserMessage = styled(MessageBase)
` 
`

const NonUserMessage = styled(MessageBase)
` 
`


function MessagesList({messages, isTyping, botName}) {
  return (
   <Container>
    {messages.map((message,index)=>{
        if(message.isUser){
            return(
                <UserMessageWrap key={index}>
                    <UserMessage className="chatbot-primary">{message.text}</UserMessage>
                    {message.unread ? null : <div>read</div>}
                </UserMessageWrap>
            )
        }
        
        return(
           <NonUserMessageWrap key={index}>
            <NonUserMessage
               className="chatbot-secondary"
            >{message.text}</NonUserMessage>
           </NonUserMessageWrap>
        )
    })}
    {isTyping && <p>{botName} is Typing...</p>}
   </Container>
  )
}

export default MessagesList
