'use client'

import Image from 'next/image'

interface AgendaSpeakerCardProps {
  speaker: {
    id: number
    first_name: string
    last_name: string
    job_title?: string
    bio?: string
    profile_picture_url?: string
    social_linkedin_url?: string
    social_facebook_url?: string
    social_instagram_url?: string
  }
}

export const AgendaSpeakerCard = ({ speaker }: AgendaSpeakerCardProps) => {
  const fullName = `${speaker.first_name} ${speaker.last_name}`
  const imageSrc = speaker.profile_picture_url || '/images/speaker-placeholder.jpg'

  return (
    <div className="border rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow bg-white dark:bg-neutral-900">
      <div className="w-24 h-24 relative mb-4">
        <Image
          src={imageSrc}
          alt={fullName}
          width={96}
          height={96}
          className="rounded-full object-cover"
        />
      </div>
      <h3 className="text-lg font-semibold">{fullName}</h3>
      {speaker.job_title && (
        <p className="text-sm text-gray-500 mt-1">{speaker.job_title}</p>
      )}
      {speaker.bio && (
        <p className="mt-3 text-gray-700 dark:text-gray-300 text-sm">{speaker.bio}</p>
      )}
      <div className="flex space-x-4 mt-4">
        {speaker.social_linkedin_url && (
          <a
            href={speaker.social_linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 text-sm"
          >
            LinkedIn
          </a>
        )}
        {speaker.social_facebook_url && (
          <a
            href={speaker.social_facebook_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 text-sm"
          >
            Facebook
          </a>
        )}
        {speaker.social_instagram_url && (
          <a
            href={speaker.social_instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 text-sm"
          >
            Instagram
          </a>
        )}
      </div>
    </div>
  )
}
