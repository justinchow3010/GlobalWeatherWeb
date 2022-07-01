const Logout = () => {
    fetch("/api/logout", {
        method: "POST",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
        .then(res => res.json())
        .then(data => {
            console.log(data)
        })
}