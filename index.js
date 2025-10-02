const video = document.querySelector("video");
if (!video) throw new Error("Does not found video element");

const subtitleElement = document.getElementById("subtitle");
if (!subtitleElement) throw new Error("Does not found subtitle element");

const aspectRaito = 864 / 576;

function calculateVideoSize() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let videoHeight = windowHeight;
    let videoWidth = videoHeight / aspectRaito;

    if (videoWidth > windowWidth) {
        videoWidth = windowWidth;
        videoHeight = videoWidth * aspectRaito;
    }

    video.width = videoWidth;
    video.height = videoHeight;
}
calculateVideoSize();
window.addEventListener("resize", () => calculateVideoSize());

const submitBtn = document.getElementById("submit");
if (!submitBtn) throw new Error("Does not found submit button");

function capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function showVideo(name, role, auto) {
    const formWrapperElement = document.getElementById("form-wrapper");
    if (!formWrapperElement) throw new Error("Does not found form wrapper element");

    const containerElement = document.getElementById("container");
    if (!containerElement) throw new Error("Does not found container element");

    name = capitalize((name || "").trim().split(" ").at(-1));

    formWrapperElement.style.display = "none";
    containerElement.style.display = "flex";
    if (!auto) video.play();

    let s1 = "";
    let s2 = "";

    if (role == "anh") {
        s1 = name ? `anh ${name}` : "anh";
        s2 = "em";
    } else if (role == "chi") {
        s1 = name ? `chị ${name}` : "chị";
        s2 = "em";
    } else if (role == "ban") {
        s1 = name ? `bạn ${name}` : "bạn";
        s2 = "bạn";
    } else if (role == "em") {
        s1 = name ? `em ${name}` : "em";
        s2 = "anh";
    } else {
        s1 = name ? name : "bạn";
        s2 = "bạn";
    }

    const messages = [
        [`Mời ${s1} đến dự lễ tốt nghiệp của ${s2} Hùng`, [10, 31.25]],
        ["Thời gian: 10h sáng thứ 7 ngày 4/10/2025", [31.25, 50]],
        ["Địa điểm: Hội trường C2 - Đại học Bách khoa Hà Nội", [50, 75]],
        [`Rất vui khi có sự có mặt của ${s1} trong buổi lễ`, [75, 99]]
    ];

    function insertVideoSubtitle(content) {
        subtitleElement.innerText = content;
    }

    video.addEventListener("timeupdate", () => {
        if (video.duration > 0) {
            const percent = (video.currentTime / video.duration) * 100;
            for (const data of messages) {
                const range = data[1];
                if (range[0] < percent && percent < range[1]) {
                    insertVideoSubtitle(data[0]);
                    return;
                }
            }
            insertVideoSubtitle("");
        }
    });

    video.addEventListener("ended", () => video.currentTime = 0);

    let isPlaying = false;
    video.addEventListener("click", () => {
        if (isPlaying) {
            video.pause();
        } else {
            video.play();
        }

        isPlaying = !isPlaying;
    });
}

submitBtn.addEventListener("click", () => {
    const nameInputElement = document.getElementById("name");
    if (!nameInputElement) throw new Error("Does not found name input element");

    const roleSelectElement = document.getElementById("role");
    if (!roleSelectElement) throw new Error("Does not found role select element");

    const name = nameInputElement.value;
    const role = roleSelectElement.value;

    if (name.trim() == "") return;

    showVideo(name, role, false);
});

const params = new URLSearchParams(window.location.search);

const nameParam = params.get("name");
const roleParam = params.get("role");

if (nameParam && nameParam.trim()) {
    showVideo(nameParam, roleParam, true);
}
