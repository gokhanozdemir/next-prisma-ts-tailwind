import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { prisma } from '../lib/prisma'

interface FormData {
  title: string,
  content: string,
  id: string
}

const Home: NextPage = () => {
  const [form, setForm] = useState<FormData>({ title: "", content: "", id: "" });

  async function create(data: FormData) {
    try {
      console.log("fetchStart")
      fetch('http://localhost:3000/api/create', {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: "POST"
      })
        .then(() => console.log("fetchEnd"))
        .then(() => setForm({ title: '', content: '', id: '' }))
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async (data: FormData) => {
    try {
      create(data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <h1 className="text-center font-bold text-2xl mt-4">Notes</h1>
      <form onSubmit={e => {
        e.preventDefault()
        handleSubmit(form)
      }}
        className='w-auto min-w-[25%] max-w-min mx-auto space-y-6 flex flex-col items-stretch'>
        <input
          type="text"
          placeholder="Title"
          value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
          name="textinp"
          id="textinp"
          className="border-2 rounded border-gray-200 p-1"
        />
        <textarea
          placeholder="Content"
          value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
          name="contentinp"
          id="contentinp"
          className="border-2 rounded border-gray-200 p-1"
        />

        <button type='submit' className='bg-blue-500 text-white rounded p-1'>Add + </button>
      </form>
    </div>
  )
}

export default Home
