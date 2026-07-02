import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useMemberStore } from "../store/memberStore"
import AddMemberModal from "../components/AddMemberModal"

export default function ProjectMembers() {
  const { projectId } = useParams()
  const { members, isLoading, error, fetchMembers } = useMemberStore()
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchMembers(projectId)
  }, [projectId])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link to={`/projects/${projectId}`} className="text-sm text-indigo-600 hover:underline">
              ← Back to board
            </Link>
            <h1 className="text-xl font-semibold text-gray-900 mt-1">Members</h1>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
          >
            + Add Member
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
            {error}
          </div>
        )}

        {isLoading ? (
          <p className="text-gray-500">Loading members...</p>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
            {members.map((member) => (
              <div key={member.user._id} className="flex justify-between items-center px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {member.user.fullName || member.user.username}
                  </p>
                  <p className="text-xs text-gray-500">@{member.user.username}</p>
                </div>
                <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600 capitalize">
                  {member.role.replace("_", " ")}
                </span>
              </div>
            ))}
            {members.length === 0 && (
              <p className="text-sm text-gray-400 px-4 py-6 text-center">No members yet</p>
            )}
          </div>
        )}
      </div>

      <AddMemberModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} projectId={projectId} />
    </div>
  )
}