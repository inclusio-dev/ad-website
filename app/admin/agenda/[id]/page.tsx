'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'

export default function AdminSessionPage() {
  const { id } = useParams()
  const router = useRouter()

  const [session, setSession] = useState<any>(null)
  const [form, setForm] = useState({
    title: '',
    start: '',
    location: '',
    speakers: [] as { first_name: string; last_name: string; link: string; image: string }[],
  })
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/agenda/${id}`)
        if (!res.ok) throw new Error('Errore caricamento sessione')
        const data = await res.json()
        setSession(data.session)
        setForm({
          title: data.session.title ?? '',
          start: data.session.start ?? '',
          location: data.session.location ?? '',
          speakers: data.session.speakers ?? [],
        })
      } catch (err) {
        console.error('Errore fetch sessione:', err)
      }
    }
    if (id) fetchSession()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSpeakerChange = (index: number, key: string, value: string) => {
    const updated = [...form.speakers]
    updated[index][key as keyof typeof updated[number]] = value
    setForm({ ...form, speakers: updated })
  }

  const handleImageUpload = async (index: number, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('/api/upload/speaker', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.filename) {
        const updated = [...form.speakers]
        updated[index].image = data.filename
        setForm({ ...form, speakers: updated })
      }
    } catch (err) {
      console.error('Errore upload immagine:', err)
    }
  }

  const handleAddSpeaker = () => {
    setForm({
      ...form,
      speakers: [...form.speakers, { first_name: '', last_name: '', link: '', image: '' }],
    })
  }

  const validateForm = () => {
    const errs: string[] = []
    if (!form.title.trim()) errs.push('Il titolo è obbligatorio')
    if (!form.start.trim()) errs.push("L'orario di inizio è obbligatorio")
    if (!form.location.trim()) errs.push('La location è obbligatoria')
    setErrors(errs)
    return errs.length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return
    try {
      setSaving(true)
      const res = await fetch(`/api/agenda/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Errore salvataggio')
      router.push('/admin/agenda')
    } catch (err) {
      console.error('Errore nel salvataggio:', err)
    } finally {
      setSaving(false)
    }
  }

  if (!session) return <p className="p-8">Caricamento sessione...</p>

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold mb-2">{session.title}</h1>
        <p className="text-lg text-gray-600">
          {new Date(session.date).toLocaleDateString('it-IT', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          })}{' '}
          — {session.start} presso {session.location}
        </p>

        {errors.length > 0 && (
          <div className="bg-red-100 text-red-700 p-4 rounded">
            <ul className="list-disc list-inside space-y-1">
              {errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Modifica dettagli</h2>
          <div className="grid grid-cols-1 gap-4">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Titolo sessione"
              className="w-full p-2 border rounded"
            />
            <input
              name="start"
              value={form.start}
              onChange={handleChange}
              placeholder="Orario di inizio"
              className="w-full p-2 border rounded"
            />
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Luogo"
              className="w-full p-2 border rounded"
            />
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Speaker</h2>
            <button
              onClick={handleAddSpeaker}
              className="text-sm bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
            >
              + Aggiungi speaker
            </button>
          </div>

          {form.speakers.map((speaker, index) => (
            <div
              key={index}
              className="p-4 border rounded bg-gray-50 space-y-3"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nome"
                  value={speaker.first_name}
                  onChange={(e) => handleSpeakerChange(index, 'first_name', e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Cognome"
                  value={speaker.last_name}
                  onChange={(e) => handleSpeakerChange(index, 'last_name', e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="url"
                  placeholder="Link profilo"
                  value={speaker.link}
                  onChange={(e) => handleSpeakerChange(index, 'link', e.target.value)}
                  className="w-full p-2 border rounded col-span-full"
                />
              </div>

              {speaker.image ? (
                <Image
                  src={`/sponsors/${speaker.image}`}
                  alt={speaker.first_name}
                  width={96}
                  height={96}
                  className="rounded object-cover"
                />
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleImageUpload(index, e.target.files[0])
                  }}
                  className="w-full"
                />
              )}
            </div>
          ))}
        </section>

        <div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Salvataggio...' : 'Salva modifiche'}
          </button>
        </div>
      </div>
    </div>
  )
}