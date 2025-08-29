import React from 'react'

function Button({onClick, children} : {onClick: ()=> void, children: React.ReactNode} ) {
  return (
    <button type='button' onClick={onClick}>
        {children}
    </button>
  )
}

export default Button