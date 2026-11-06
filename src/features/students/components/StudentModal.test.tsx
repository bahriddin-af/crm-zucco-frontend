import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StudentModal } from './StudentModal'
import { studentApi } from '../api/studentApi'
import {
  GENDER,
  PARENT_RELATIONSHIP,
  STUDENT_PARENT_LIMITS,
  STUDENT_STATUS,
  type StudentDetail,
} from '../types/studentTypes'
import { createStudentParentSchema } from '../schemas/studentSchemas'
import { useLanguageStore } from '@/stores/languageStore'
import { TRANSLATIONS } from '@/i18n/messages'
import { commonMessages } from '@/i18n/messages/common'
import { studentsMessages } from '@/i18n/messages/students'
import { renderWithProviders } from '@/test/renderWithProviders'

vi.mock('../api/studentApi', () => ({
  studentApi: { createOrUpdateStudent: vi.fn() },
}))

const form = studentsMessages.en.form

const student: StudentDetail = {
  id: 'student-1',
  fullName: 'Aziz Karimov',
  phone: '+998901112233',
  gender: GENDER.Male,
  status: STUDENT_STATUS.Active,
  balance: 0,
  coinsBalance: 0,
  parents: [
    { id: 'parent-1', fullName: 'Karim Karimov', phone: '+998901234567', relationship: PARENT_RELATIONSHIP.Father },
    { id: 'parent-2', fullName: 'Lola Karimova', phone: '+998907654321', relationship: PARENT_RELATIONSHIP.Mother },
  ],
  enrolledGroups: [],
  createdAt: '2026-11-01T10:00:00Z',
}

const parentsFieldset = () => within(screen.getByRole('group', { name: form.parentsTitle }))

const submitForm = () => userEvent.click(screen.getByRole('button', { name: commonMessages.en.save }))

const savedPayload = () => vi.mocked(studentApi.createOrUpdateStudent).mock.calls[0][0]

describe('StudentModal parents editor', () => {
  beforeEach(() => {
    useLanguageStore.getState().setLanguage('en')
    vi.mocked(studentApi.createOrUpdateStudent).mockReset().mockResolvedValue(student)
  })

  it('prefills existing parents and sends the full list on save', async () => {
    renderWithProviders(<StudentModal student={student} onClose={vi.fn()} />)

    expect(parentsFieldset().getAllByLabelText(new RegExp(form.parentFullName))).toHaveLength(2)
    await submitForm()

    await waitFor(() => expect(studentApi.createOrUpdateStudent).toHaveBeenCalledTimes(1))
    expect(savedPayload().parents).toEqual(student.parents)
  })

  it('adds a new parent row and normalizes its phone', async () => {
    renderWithProviders(<StudentModal student={{ ...student, parents: [] }} onClose={vi.fn()} />)

    await userEvent.click(screen.getByRole('button', { name: form.addParent }))
    await userEvent.type(parentsFieldset().getByLabelText(new RegExp(form.parentFullName)), 'Dilnoza Karimova')
    await userEvent.type(parentsFieldset().getByLabelText(new RegExp(form.parentPhone)), '+998 90 111 22 33')
    await userEvent.selectOptions(
      parentsFieldset().getByLabelText(form.parentRelationship),
      String(PARENT_RELATIONSHIP.Guardian)
    )
    await submitForm()

    await waitFor(() => expect(studentApi.createOrUpdateStudent).toHaveBeenCalledTimes(1))
    expect(savedPayload().parents).toEqual([
      { id: null, fullName: 'Dilnoza Karimova', phone: '+998901112233', relationship: PARENT_RELATIONSHIP.Guardian },
    ])
  })

  it('sends an empty list when every parent row is removed', async () => {
    renderWithProviders(<StudentModal student={student} onClose={vi.fn()} />)

    for (const button of screen.getAllByRole('button', { name: form.removeParent })) {
      await userEvent.click(button)
    }
    await submitForm()

    await waitFor(() => expect(studentApi.createOrUpdateStudent).toHaveBeenCalledTimes(1))
    expect(savedPayload().parents).toEqual([])
  })

  it('blocks saving while a parent row is incomplete', async () => {
    renderWithProviders(<StudentModal student={{ ...student, parents: [] }} onClose={vi.fn()} />)

    await userEvent.click(screen.getByRole('button', { name: form.addParent }))
    await submitForm()

    expect(await parentsFieldset().findAllByText(commonMessages.en.requiredField)).toHaveLength(2)
    expect(studentApi.createOrUpdateStudent).not.toHaveBeenCalled()
  })
})

describe('createStudentParentSchema', () => {
  const schema = createStudentParentSchema(TRANSLATIONS.en)
  const valid = { id: null, fullName: 'Karim', phone: '+998901234567', relationship: PARENT_RELATIONSHIP.Father }

  it('accepts a valid parent', () => {
    expect(schema.safeParse(valid).success).toBe(true)
  })

  it.each([
    ['blank name', { fullName: '   ' }],
    ['too long name', { fullName: 'a'.repeat(STUDENT_PARENT_LIMITS.FULL_NAME + 1) }],
    ['invalid phone', { phone: 'abc' }],
    ['unknown relationship', { relationship: 9 }],
  ])('rejects %s like the backend', (_case, override) => {
    expect(schema.safeParse({ ...valid, ...override }).success).toBe(false)
  })
})
