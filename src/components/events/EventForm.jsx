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

function Field({ label, error, children, required }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-[#1A2E3E]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}

const inputClass = "w-full rounded-2xl border border-[#C8D8E4] bg-white px-4 py-3 text-sm text-[#1A2E3E] outline-none transition placeholder-[#8AABBD] focus:border-[#7AAFC7] focus:ring-4 focus:ring-[#7AAFC7]/10"
const sectionClass = "space-y-4 rounded-3xl border border-[#C8D8E4] bg-white p-7 shadow-sm"

export default function EventForm({ onSubmit, onCancel }) {
  const { user } = useAuth()
  const { submitEvent, saveDraft } = useEvents()
  const [form, setForm] = useState({ ...INITIAL, institution: user?.institution || '' })
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
    reader.onload = () => set('image', String(reader.result || ''))
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
      const rawData = { ...form, institution: form.institution || user?.institution || '' }
      const payload = normalizeEventPayload(rawData)
      const result  = await submitEvent(payload)
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
    if (!form.title.trim()) { setErrors({ title: 'Title is required to save a draft' }); return }
    setErrors({})
    setIsSubmitting(true)
    setSubmitError('')
    try {
      const rawData = { ...form, institution: form.institution || user?.institution || '' }
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
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EDF4F9]">
          <FileText size={28} className="text-[#7AAFC7]" />
        </div>
        <h3 className="mb-2 text-2xl font-bold text-[#1A2E3E]">Draft Saved</h3>
        <p className="mb-8 max-w-md text-[#4A6070]">
          <span className="font-medium text-[#1A2E3E]">"{form.title}"</span> has been saved as a draft. You can find it in your dashboard and submit it for review whenever you're ready.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setDraftSaved(false)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#C8D8E4] bg-white px-5 py-3 text-sm font-bold text-[#4A6070] shadow-sm transition hover:border-[#7AAFC7] hover:bg-[#EDF4F9] hover:text-[#3B5F82]"
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
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EDF4F9]">
          <AlertTriangle size={28} className="text-[#7AAFC7]" />
        </div>
        <h3 className="mb-2 text-2xl font-bold text-[#1A2E3E]">Event Submitted for Review</h3>
        <p className="mb-1 max-w-md text-[#4A6070]">
          Your event <span className="font-medium text-[#1A2E3E]">"{form.title}"</span> has been submitted and is now undergoing automated risk analysis and validation.
        </p>
        <p className="mb-8 text-sm text-[#8AABBD]">Typical review time: 2–24 hours</p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <div className="flex items-center gap-3 rounded-xl border border-[#C8D8E4] bg-[#EDF4F9] p-3">
            <CheckCircle size={16} className="text-[#7AAFC7]" />
            <span className="text-sm text-[#4A6070]">Submission received</span>
          </div>
          {modResult && (
            <div className={`flex items-center gap-3 p-3 rounded-xl border ${
              modResult.riskLevel === 'high'   ? 'bg-red-50 border-red-200' :
              modResult.riskLevel === 'medium' ? 'bg-amber-50 border-amber-200' :
                                                 'bg-emerald-50 border-emerald-200'
            }`}>
              <CheckCircle size={16} className={
                modResult.riskLevel === 'high'   ? 'text-red-500' :
                modResult.riskLevel === 'medium' ? 'text-amber-500' : 'text-emerald-500'
              } />
              <span className="text-sm text-[#4A6070]">
                Risk analysis complete — {modResult.riskLevel} risk ({modResult.riskScore}/100)
              </span>
            </div>
          )}
          {!modResult && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-200">
              <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-[#4A6070]">Risk analysis in progress</span>
            </div>
          )}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#EDF4F9] border border-[#C8D8E4]">
            <div className="w-4 h-4 rounded-full border-2 border-[#C8D8E4]" />
            <span className="text-sm text-[#8AABBD]">Moderation review</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#EDF4F9] border border-[#C8D8E4]">
            <div className="w-4 h-4 rounded-full border-2 border-[#C8D8E4]" />
            <span className="text-sm text-[#8AABBD]">Publication</span>
          </div>
        </div>
        <button
          onClick={() => { setSubmitted(false); setDraftSaved(false); setModResult(null); setForm({ ...INITIAL, institution: user?.institution || '' }) }}
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl border border-[#C8D8E4] bg-white px-5 py-3 text-sm font-bold text-[#4A6070] shadow-sm transition hover:border-[#7AAFC7] hover:bg-[#EDF4F9] hover:text-[#3B5F82]"
        >
          Submit Another Event
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className={sectionClass}>
        <h3 className="text-base font-extrabold text-[#1A2E3E]">Basic Information</h3>
        <Field label="Event Title" error={errors.title} required>
          <input className={inputClass} placeholder="e.g. Annual Tech Conference 2026" value={form.title} onChange={e => set('title', e.target.value)} />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Category" error={errors.category} required>
            <select className={inputClass} value={form.category} onChange={e => set('category', e.target.value)}>
              <option value="">Select category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Institution">
            <input className="w-full rounded-2xl border border-[#C8D8E4] bg-[#EDF4F9] px-4 py-3 text-sm text-[#4A6070] outline-none" value={form.institution} readOnly />
          </Field>
        </div>
        <Field label="Description" error={errors.description} required>
          <textarea
            className={inputClass + ' resize-none'}
            rows={4}
            placeholder="Describe your event in detail (min. 50 characters)..."
            value={form.description}
            onChange={e => set('description', e.target.value)}
          />
          <p className="mt-1 text-xs text-[#8AABBD]">{form.description.length} characters</p>
        </Field>
      </div>

      {/* Date & Location */}
      <div className={sectionClass}>
        <h3 className="text-base font-extrabold text-[#1A2E3E]">Date & Location</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Date" error={errors.date} required>
            <input type="date" className={inputClass} value={form.date} onChange={e => set('date', e.target.value)} min="2026-04-19" />
          </Field>
          <Field label="Time">
            <input type="time" className={inputClass} value={form.time} onChange={e => set('time', e.target.value)} />
          </Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="City" error={errors.location} required>
            <select className={inputClass} value={form.location} onChange={e => set('location', e.target.value)}>
              <option value="">Select city</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Venue Name" error={errors.venue} required>
            <input className={inputClass} placeholder="e.g. Convention Center Hall A" value={form.venue} onChange={e => set('venue', e.target.value)} />
          </Field>
        </div>
      </div>

      {/* Capacity & Pricing */}
      <div className={sectionClass}>
        <h3 className="text-base font-extrabold text-[#1A2E3E]">Capacity & Pricing</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Capacity" error={errors.capacity} required>
            <input type="number" className={inputClass} placeholder="e.g. 500" min="1" value={form.capacity} onChange={e => set('capacity', e.target.value)} />
          </Field>
          <Field label="Ticket Price ($)" error={errors.price}>
            <input type="number" className={inputClass} placeholder="0 for free" min="0" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} />
          </Field>
        </div>
      </div>

      {/* Media & Tags */}
      <div className={sectionClass}>
        <h3 className="text-base font-extrabold text-[#1A2E3E]">Media & Tags</h3>
        <Field label="Event Image">
          <div className="space-y-3">
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#C8D8E4] bg-white px-5 py-3 text-sm font-bold text-[#4A6070] shadow-sm transition hover:border-[#7AAFC7] hover:bg-[#EDF4F9] hover:text-[#3B5F82]"
              >
                <Upload size={15} /> Upload Image
              </button>
              {form.image && (
                <button
                  type="button"
                  onClick={() => { set('image', ''); if (fileInputRef.current) fileInputRef.current.value = '' }}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#C8D8E4] bg-white px-5 py-3 text-sm font-bold text-[#4A6070] shadow-sm transition hover:border-[#7AAFC7] hover:bg-[#EDF4F9] hover:text-[#3B5F82]"
                >
                  <X size={14} /> Remove Image
                </button>
              )}
            </div>
            {form.image && (
              <div className="w-full max-w-sm rounded-2xl overflow-hidden border border-[#C8D8E4] bg-[#EDF4F9]">
                <img src={form.image} alt="Event preview" className="w-full h-48 object-cover" />
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[#1A2E3E]">Or paste image URL</label>
              <input className={inputClass} placeholder="https://example.com/image.jpg" value={form.image} onChange={e => set('image', e.target.value)} />
            </div>
          </div>
        </Field>
        <Field label="Tags">
          <div className="flex gap-2">
            <input
              className={inputClass}
              placeholder="Add a tag and press Enter"
              value={form.tagInput}
              onChange={e => set('tagInput', e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
            />
            <button type="button" onClick={addTag} className="shrink-0 rounded-2xl border border-[#C8D8E4] bg-[#EDF4F9] px-5 text-[#3B5F82] transition hover:bg-[#C8D8E4]">
              <Plus size={14} />
            </button>
          </div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {form.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 rounded-full border border-[#7AAFC7] px-3 py-1 text-xs font-semibold text-[#3B5F82]" style={{ background: 'rgba(122,175,199,0.15)' }}>
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
      <div className="flex items-start gap-3 rounded-2xl border border-[#C8D8E4] bg-[#EDF4F9] p-4">
        <AlertTriangle size={16} className="mt-0.5 shrink-0 text-[#7AAFC7]" />
        <p className="text-sm font-medium text-[#4A6070]">
          Your event will undergo automated risk analysis and manual moderation review before publication. Events with high risk scores will be escalated to the Manual Review Queue.
        </p>
      </div>

      {submitError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-xl">{submitError}</p>
      )}

      <div className="flex items-center gap-3 justify-end flex-wrap">
        {onCancel && (
          <button type="button" onClick={onCancel} disabled={isSubmitting} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#C8D8E4] bg-white px-5 py-3 text-sm font-bold text-[#4A6070] shadow-sm transition hover:border-[#7AAFC7] hover:bg-[#EDF4F9] hover:text-[#3B5F82]">Cancel</button>
        )}
        <button
          type="button"
          onClick={handleSaveDraft}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#C8D8E4] bg-white px-5 py-3 text-sm font-bold text-[#4A6070] shadow-sm transition hover:border-[#7AAFC7] hover:bg-[#EDF4F9] hover:text-[#3B5F82]"
        >
          <FileText size={15} /> Save as Draft
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#7AAFC7] hover:bg-[#3B5F82] px-6 py-3 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Submitting…</>
          ) : (
            <><Upload size={15} /> Submit for Review</>
          )}
        </button>
      </div>
    </form>
  )
}
