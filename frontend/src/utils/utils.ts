export const getMonthName = (monthNumber: number) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]
    return months[monthNumber - 1] || "Invalid month"
}

export const formatDateTime = (isoString: string) => {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    }).format(new Date(isoString))
}
export const formatDuration = (seconds: number): string => {
    const totalSeconds = Math.floor(seconds)
    const minutes = Math.floor(totalSeconds / 60)
    const remainingSeconds = totalSeconds % 60

    const mm = minutes.toString().padStart(2, '0')
    const ss = remainingSeconds.toString().padStart(2, '0')

    return `${mm}:${ss}`
}
