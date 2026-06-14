import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  /** Shown in place of the children when they throw. */
  fallback: ReactNode
}

interface State {
  error: Error | null
}

/**
 * Catches render errors in a subtree so one failing feature (e.g. the
 * map, which integrates the imperative Leaflet library) does not blank
 * out the whole app. In dev the message is surfaced for debugging.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <>
          {this.props.fallback}
          {import.meta.env.DEV && (
            <pre className="mt-3 overflow-auto rounded-md border border-edge bg-surface p-3 text-meta text-conf-warn">
              {this.state.error.message}
            </pre>
          )}
        </>
      )
    }
    return this.props.children
  }
}
