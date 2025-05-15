import OrderStep1 from '@/components/OrderStep1'
import React from 'react'

const page = () => {
  return (
    <div className="h-screen w-full  ">
          <div className="min-h-[100vh] w-full bg-gradient-to-r from-[#303F48] to-[#6D7276]">
            <OrderStep1/>
          </div>
        </div>
  )
}

export default page