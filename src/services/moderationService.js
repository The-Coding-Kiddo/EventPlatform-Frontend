// Keyword lists for risk analysis
const HIGH_RISK_KEYWORDS = [
  'controversial', 'inflammatory', 'hate', 'extremist', 'radical',
  'riot', 'attack', 'illegal', 'unauthorized', 'protest',
]

const MEDIUM_RISK_KEYWORDS = [
  'crypto', 'blockchain', 'nft', 'defi', 'investment', 'trading',
  'financial', 'profit', 'returns', 'rally', 'demonstration',
]

// Base risk score per category
const CATEGORY_BASE_RISK = {
  'Technology':      5,
  'Music':           5,
  'Arts & Culture':  3,
  'Sports':          8,
  'Business':       10,
  'Food & Drink':    2,
  'Health & Wellness': 3,
  'Education':       2,
  'Community':      15,
  'Entertainment':   5,
}

/**
 * Runs a mock risk analysis on a submitted event.
 * Returns { riskScore, riskLevel, flagReason, autoFlags, requiresManualReview }
 *
 * Structured to be dropped in place by a real backend service later.
 */
export function analyzeEvent(event) {
  let score = CATEGORY_BASE_RISK[event.category] ?? 5
  const autoFlags = []
  const reasons = []

  const text = [event.title, event.description, ...(event.tags ?? [])].join(' ').toLowerCase()

  // High-risk keyword scan
  const highMatches = HIGH_RISK_KEYWORDS.filter(k => text.includes(k))
  if (highMatches.length > 0) {
    score += highMatches.length * 20
    autoFlags.push('hate_speech_indicator')
    reasons.push('Contains potentially inflammatory or high-risk language')
  }

  // Medium-risk keyword scan
  const medMatches = MEDIUM_RISK_KEYWORDS.filter(k => text.includes(k))
  if (medMatches.length > 0) {
    score += medMatches.length * 10
    autoFlags.push('financial_promotion')
    reasons.push('Potential financial promotion without regulatory disclosure')
  }

  // Large-gathering risk
  const capacity = Number(event.capacity) || 0
  if (capacity >= 10000) {
    score += 15
    autoFlags.push('mass_gathering_risk')
    reasons.push('Large-scale gathering requires additional safety review')
  } else if (capacity >= 5000) {
    score += 8
  }

  // Free + very large = potential crowd-control issue
  if (Number(event.price) === 0 && capacity >= 5000) {
    score += 10
    if (!reasons.some(r => r.includes('crowd'))) {
      reasons.push('Free large-scale event may attract unmanaged crowds')
    }
  }

  score = Math.min(100, Math.round(score))

  const riskLevel = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low'

  if (reasons.length === 0) {
    reasons.push(riskLevel === 'low' ? 'No significant risk indicators detected' : 'Standard moderation review required')
  }
  if (autoFlags.length === 0) {
    autoFlags.push('standard_review')
  }

  return {
    riskScore: score,
    riskLevel,
    flagReason: reasons[0],
    autoFlags,
    requiresManualReview: score >= 40,
  }
}
