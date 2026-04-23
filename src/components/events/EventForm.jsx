import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Upload, X, Plus, AlertTriangle, CheckCircle, FileText } from 'lucide-react'
import { CATEGORIES, CITIES } from '../../data/constants'
import { useAuth } from '../../context/AuthContext'
import { useEvents } from '../../context/EventContext'
import { normalizeEventPayload } from '../../models'

const INITIAL = {
  title: '', category: '', date: '', time: '', location: '',
  venue: '', description: '', price: '', capacity: '',
  tags: [], tagInput: '', image: '',
}

// ── Defined OUTSIDE EventForm so React never treats it as a new type on re-render.
// Keeping it inside would cause all inputs to unmount/remount on every keystroke.
function Field({ label, error, children, required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}

export default function EventForm({ onSubmit, onCancel }) {
  const { user } = useAuth()
  const { submitEvent, saveDraft } = useEvents()
  const [form, setForm] = useState({
    ...INITIAL,
    institution: user?.institution || '',
  })
  const [submitted,    setSubmitted]    = useState(false)
  const [draftSaved,   setDraftSaved]   = useState(false)
  const [modResult,    setModResult]    = useState(null)
  const [errors,       setErrors]       = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError,  setSubmitError]  = useState('')

  const fileInputRef = useRef(null)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      set('image', String(reader.result || ''))
    }
    reader.readAsDataURL(file)
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.category) e.category = 'Category is required'
    if (!form.date) e.date = 'Date is required'
    if (!form.location) e.location = 'Location is required'
    if (!form.venue.trim()) e.venue = 'Venue is required'
    if (!form.description.trim() || form.description.length < 50) e.description = 'Description must be at least 50 characters'
    if (!form.capacity || isNaN(form.capacity) || Number(form.capacity) < 1) e.capacity = 'Valid capacity required'
    if (form.price !== '' && isNaN(form.price)) e.price = 'Price must be a number'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    setSubmitError('')
    try {
      const rawData  = { ...form, institution: form.institution || user?.institution || '' }
      const payload  = normalizeEventPayload(rawData)
      const result   = await submitEvent(payload)
      setModResult(result.moderation)
      setSubmitted(true)
      onSubmit?.(result.event)
    } catch (err) {
      setSubmitError(err.message || 'Submission failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const addTag = () => {
    if (form.tagInput.trim() && !form.tags.includes(form.tagInput.trim())) {
      set('tags', [...form.tags, form.tagInput.trim()])
      set('tagInput', '')
    }
  }

  const removeTag = (tag) => set('tags', form.tags.filter(t => t !== tag))

  const handleSaveDraft = async () => {
    // Only require a title for drafts — all other fields can be filled in later.
    if (!form.title.trim()) {
      setErrors({ title: 'Title is required to save a draft' })
      return
    }
    setErrors({})
    setIsSubmitting(true)
    setSubmitError('')
    try {
      const rawData = {
        ...form,
        institution: form.institution || user?.institution || '',
      }
      const payload = normalizeEventPayload(rawData)
      await saveDraft(payload)
      setDraftSaved(true)
    } catch (err) {
      setSubmitError(err.message || 'Failed to save draft. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (draftSaved) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
          <FileText size={28} className="text-blue-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Draft Saved</h3>
        <p className="text-gray-600 max-w-md mb-8">
          <span className="text-gray-900 font-medium">"{form.title}"</span> has been saved as a draft. You can find it in your dashboard and submit it for review whenever you're ready.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => { setDraftSaved(false) }}
            className="btn-secondary"
          >
            Continue Editing
          </button>
          <Link to="/dashboard" className="btn-primary">
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle size={28} className="text-amber-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Event Submitted for Review</h3>
        <p className="text-gray-600 max-w-md mb-1">
          Your event <span className="text-gray-900 font-medium">"{form.title}"</span> has been submitted and is now undergoing automated risk analysis and validation.
        </p>
        <p className="text-gray-500 text-sm mb-8">Typical review time: 2–24 hours</p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-200">
            <CheckCircle size={16} className="text-blue-600" />
            <span className="text-sm text-gray-600">Submission received</span>
          </div>
          {modResult && (
            <div className={`flex items-center gap-3 p-3 rounded-xl border ${
              modResult.riskLevel === 'high'   ? 'bg-red-50 border-red-200' :
              modResult.riskLevel === 'medium' ? 'bg-amber-50 border-amber-200' :
                                                 'bg-emerald-50 border-emerald-200'
            }`}>
              <CheckCircle size={16} className={
                modResult.riskLevel === 'high'   ? 'text-red-500' :
                modResult.riskLevel === 'medium' ? 'text-amber-500' :
                                                   'text-emerald-500'
              } />
              <span className="text-sm text-gray-600">
                Risk analysis complete — {modResult.riskLevel} risk ({modResult.riskScore}/100)
              </span>
            </div>
          )}
          {!modResult && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-200">
              <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-600">Risk analysis in progress</span>
            </div>
          )}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200">
            <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
            <span className="text-sm text-gray-400">Moderation review</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200">
            <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
            <span className="text-sm text-gray-400">Publication</span>
          </div>
        </div>
        <button
          onClick={() => {
            setSubmitted(false)
            setDraftSaved(false)
            setModResult(null)
            setForm({ ...INITIAL, institution: user?.institution || '' })
          }}
          className="btn-secondary mt-8"
        >
          Submit Another Event
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="card p-6 space-y-4">
        <h3 className="font-semibold text-gray-900 text-base">Basic Information</h3>
        <Field label="Event Title" error={errors.title} required>
          <input className="input" placeholder="e.g. Annual Tech Conference 2026" value={form.title} onChange={e => set('title', e.target.value)} />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Category" error={errors.category} required>
            <select className="input" value={form.category} onChange={e => set('category', e.target.value)}>
              <option value="">Select category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Institution">
            <input className="input bg-gray-50" value={form.institution} readOnly />
          </Field>
        </div>
        <Field label="Description" error={errors.description} required>
          <textarea
            className="input resize-none"
            rows={4}
            placeholder="Describe your event in detail (min. 50 characters)..."
            value={form.description}
            onChange={e => set('description', e.target.value)}
          />
          <p className="text-xs text-gray-400 mt-1">{form.description.length} characters</p>
        </Field>
      </div>

      {/* Date & Location */}
      <div className="card p-6 space-y-4">
        <h3 className="font-semibold text-gray-900 text-base">Date & Location</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Date" error={errors.date} required>
            <input type="date" className="input" value={form.date} onChange={e => set('date', e.target.value)} min="2026-04-19" />
          </Field>
          <Field label="Time">
            <input type="time" className="input" value={form.time} onChange={e => set('time', e.target.value)} />
          </Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="City" error={errors.location} required>
            <select className="input" value={form.location} onChange={e => set('location', e.target.value)}>
              <option value="">Select city</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Venue Name" error={errors.venue} required>
            <input className="input" placeholder="e.g. Convention Center Hall A" value={form.venue} onChange={e => set('venue', e.target.value)} />
          </Field>
        </div>
      </div>

      {/* Capacity & Pricing */}
      <div className="card p-6 space-y-4">
        <h3 className="font-semibold text-gray-900 text-base">Capacity & Pricing</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Capacity" error={errors.capacity} required>
            <input type="number" className="input" placeholder="e.g. 500" min="1" value={form.capacity} onChange={e => set('capacity', e.target.value)} />
          </Field>
          <Field label="Ticket Price ($)" error={errors.price}>
            <input type="number" className="input" placeholder="0 for free" min="0" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} />
          </Field>
        </div>
      </div>

      {/* Media & Tags */}
      <div className="card p-6 space-y-4">
        <h3 className="font-semibold text-gray-900 text-base">Media & Tags</h3>
        <Field label="Event Image">
          <div className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-secondary"
              >
                <Upload size={15} /> Upload Image
              </button>

              {form.image && (
                <button
                  type="button"
                  onClick={() => {
                    set('image', '')
                    if (fileInputRef.current) fileInputRef.current.value = ''
                  }}
                  className="btn-secondary"
                >
                  <X size={14} /> Remove Image
                </button>
              )}
            </div>

            {form.image && (
              <div className="w-full max-w-sm rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
                <img src={form.image} alt="Event preview" className="w-full h-48 object-cover" />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Or paste image URL</label>
              <input
                className="input"
                placeholder="https://example.com/image.jpg"
                value={form.image}
                onChange={e => set('image', e.target.value)}
              />
            </div>
          </div>
        </Field>
        <Field label="Tags">
          <div className="flex gap-2">
            <input
              className="input"
              placeholder="Add a tag and press Enter"
              value={form.tagInput}
              onChange={e => set('tagInput', e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
            />
            <button type="button" onClick={addTag} className="btn-secondary shrink-0">
              <Plus size={14} />
            </button>
          </div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {form.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-400 transition-colors">
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </Field>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
        <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-700">
          Your event will undergo automated risk analysis and manual moderation review before publication. Events with high risk scores will be escalated to the Manual Review Queue.
        </p>
      </div>

      {submitError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-xl">
          {submitError}
        </p>
      )}

      <div className="flex items-center gap-3 justify-end flex-wrap">
        {onCancel && (
          <button type="button" onClick={onCancel} disabled={isSubmitting} className="btn-secondary">Cancel</button>
        )}
        {/* Save as Draft — persists the event as status:'draft' visible in the Drafts tab */}
        <button
          type="button"
          onClick={handleSaveDraft}
          disabled={isSubmitting}
          className="btn-secondary"
        >
          <FileText size={15} /> Save as Draft
        </button>
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? (
            <><div className="w-4 h-4 border-2 border-blue-300 border-t-white rounded-full animate-spin" /> Submitting…</>
          ) : (
            <><Upload size={15} /> Submit for Review</>
          )}
        </button>
      </div>
    </form>
  )
}
