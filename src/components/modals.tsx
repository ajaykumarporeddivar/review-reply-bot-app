'use client'

import { Button, Card, Input, Modal } from '@/components/ui'

export function EntityDetailModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open}>
      <Card className="max-w-md">
        <h2 className="text-lg font-bold text-zinc-950">Record details</h2>
        <p className="mt-2 text-sm text-zinc-500">Review the active workflow, approve the next step, or archive it from the operating queue.</p>
        <div className="mt-4 flex gap-2">
          <Button type="button" onClick={onClose}>Approve</Button>
          <Button type="button" variant="secondary" onClick={onClose}>Archive</Button>
        </div>
      </Card>
    </Modal>
  )
}

export function ConfirmModal({ open, onConfirm, onClose }: { open: boolean; onConfirm: () => void; onClose: () => void }) {
  return (
    <Modal open={open}>
      <Card className="max-w-md">
        <h2 className="text-lg font-bold text-zinc-950">Confirm action</h2>
        <div className="mt-4 flex gap-2">
          <Button type="button" onClick={onConfirm}>Confirm</Button>
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
        </div>
      </Card>
    </Modal>
  )
}

export function CommandPalette({ open = false, onClose = () => {} }: { open?: boolean; onClose?: () => void }) {
  return (
    <Modal open={open}>
      <Card className="max-w-md">
        <h2 className="text-lg font-bold text-zinc-950">Command palette</h2>
        <Input className="mt-3" placeholder="Search workflows, reports, roadmap..." />
        <Button type="button" className="mt-4" onClick={onClose}>Open selected</Button>
      </Card>
    </Modal>
  )
}
