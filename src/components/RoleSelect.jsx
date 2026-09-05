import {
  GradCapIcon,
  BriefcaseIcon,
  BookIcon,
  BuildingIcon,
  CheckIcon,
} from './Icons'

const ROLES = [
  { id: 'student', label: 'Student', hint: 'Learning & projects', Icon: GradCapIcon },
  { id: 'industry', label: 'Industry', hint: 'Hiring & partnerships', Icon: BriefcaseIcon },
  { id: 'academician', label: 'Academician', hint: 'Teaching & research', Icon: BookIcon },
  { id: 'institution', label: 'Institution', hint: 'College & university', Icon: BuildingIcon },
]

/**
 * "User Role" selector — radio-group behaviour rendered as a responsive
 * 2×2 grid of selectable cards (works great on touch screens).
 *
 * Controlled via `value` + `onChange`.
 */
export default function RoleSelect({ value, onChange }) {
  return (
    <div role="radiogroup" aria-labelledby="role-label">
      <p id="role-label" className="mb-1.5 block text-sm font-medium text-gray-700">
        I am a
      </p>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {ROLES.map(({ id, label, hint, Icon }) => {
          const selected = value === id
          return (
            <label
              key={id}
              className={`relative flex cursor-pointer flex-col items-start gap-1 rounded-xl border p-3.5 transition duration-150 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-indigo-600/50 sm:p-4 ${
                selected
                  ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-600/20'
                  : 'border-gray-300 bg-white hover:border-indigo-300 hover:bg-indigo-50/40'
              }`}
            >
              <input
                type="radio"
                name="role"
                value={id}
                required
                checked={selected}
                onChange={() => onChange(id)}
                className="sr-only"
              />

              <span
                className={`flex items-center gap-2 text-sm font-medium ${
                  selected ? 'text-indigo-700' : 'text-gray-700'
                }`}
              >
                <Icon className={`h-5 w-5 ${selected ? 'text-indigo-600' : 'text-gray-400'}`} />
                {label}
              </span>
              <span className="text-xs leading-tight text-gray-500">{hint}</span>

              {selected && (
                <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-indigo-600 text-white">
                  <CheckIcon className="h-3 w-3" />
                </span>
              )}
            </label>
          )
        })}
      </div>
    </div>
  )
}
