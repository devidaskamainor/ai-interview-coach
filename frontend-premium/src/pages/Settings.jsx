import { supabase } from '../lib/supabase'
import { useTheme } from '../lib/theme'
import Icon from '../components/Icon'
import { PageHeading } from '../components/UI'

export default function Settings({ email }) {
  const { theme, setTheme } = useTheme()
  return (
    <div className="page-stack settings-page">
      <PageHeading
        eyebrow="MAKE IT YOUR SPACE"
        title="A workspace that feels like you."
        description="Manage your appearance preferences and account session."
      />
      <section className="panel settings-section">
        <div>
          <span className="section-icon">
            <Icon name="sun" size={20} />
          </span>
          <h2>Appearance</h2>
          <p>Choose a comfortable setting for your next practice.</p>
        </div>
        <div className="theme-choices">
          {[
            { id: 'light', label: 'Light', icon: 'sun' },
            { id: 'dark', label: 'Dark', icon: 'moon' },
            { id: 'system', label: 'System', icon: 'monitor' },
          ].map((option) => (
            <button
              key={option.id}
              className={`theme-choice ${theme === option.id ? 'is-selected' : ''}`}
              aria-pressed={theme === option.id}
              onClick={() => setTheme(option.id)}
            >
              <span className={`theme-preview preview-${option.id}`}>
                <i />
                <i />
                <i />
              </span>
              <span>
                <Icon name={option.icon} size={16} />
                {option.label}
                {theme === option.id && <Icon name="checkCircle" size={16} />}
              </span>
            </button>
          ))}
        </div>
        <p className="settings-note">
          Your preference is saved on this browser. System follows your device's
          appearance.
        </p>
      </section>
      <section className="panel settings-section">
        <div>
          <span className="section-icon">
            <Icon name="shield" size={20} />
          </span>
          <h2>Your account</h2>
          <p>Your interviews and feedback are connected to this account.</p>
        </div>
        <label className="account-field">
          Email address
          <input className="field" value={email || ''} readOnly type="email" />
        </label>
        <div className="settings-signout">
          <div>
            <h3>Sign out of this workspace</h3>
            <p>Your saved interviews will be here when you return.</p>
          </div>
          <button className="btn-ghost" onClick={() => supabase.auth.signOut()}>
            <Icon name="logout" size={16} />
            Sign out
          </button>
        </div>
      </section>
    </div>
  )
}
