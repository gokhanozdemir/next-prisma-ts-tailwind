import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import { useState } from 'react'
import Router, { useRouter } from 'next/router'
import { prisma } from '../lib/prisma'
import { route } from 'next/dist/server/router'

// Declare custom data types to use in functions
interface Notes {
  notes: {
    title: string,
    content: string,
    id: string
  }
}

interface FormData {
  title: string,
  content: string,
  id: string
}

const Home = ({ notes }: Notes) => {
  const [form, setForm] = useState<FormData>({ title: "", content: "", id: "" });

  // When we made a call this refreshes the list below
  const router = useRouter()
  const refreshData = () => {
    router.replace(router.asPath)
  }



  async function create(data: FormData) {
    try {
      console.log("fetchStart")
      fetch('http://localhost:3000/api/create', {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST'
      })
        // if there is data existst with the form that is already being edited
        // then delete the former and add a new one

        .then(() => {
          if (data.id) {
            deleteNote(data.id)
          }
          console.log("fetchEnd")
          setForm({ title: '', content: '', id: '' })
          refreshData()
        })

    } catch (error) {
      console.log(error)
    }
  }

  async function deleteNote(id: string) {
    try {
      console.log(`Delete Started id:${id}`)
      fetch(`http://localhost:3000/api/note/${id}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'DELETE'
      }).then(() => {
        console.log('DELETE Completed')
        refreshData()
      })
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
      <h1 className="text-center font-bold text-2xl m-4 text-amber-600">Notes</h1>
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

        <button type='submit' className='bg-amber-600 text-white rounded p-1'>Add</button>
      </form>
      <div
        className='min-w-[25%] mx-20 flex flex-col mt-4 items-stretch'>
        <ul>
          {notes.map(note => (
            <li key={note.id} className='border-b border-gray-600 p-2' >
              <div className='flex justify-between'>
                <div className='flex-1'>
                  <h3 className='font-bold'>{note.title}</h3>
                  <p className='text-sm'>{note.content}</p>
                </div>
                {/* Actually we are not putting but adding a new one and deleting the old */}
                <div className='pt-3  '>
                  <button onClick={() => setForm({ title: note.title, content: note.content, id: note.id })} className="mr-2 m-auto text-white rounded-md bg-amber-600 px-3">Edit</button>
                  <button onClick={() => deleteNote(note.id)} className="inline-block text-white rounded-md bg-red-500 px-3">X</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
  const notes = await prisma.note.findMany({
    select: {
      title: true,
      id: true,
      content: true
    }
  })

  return {
    props: {
      notes
    }
  }
}