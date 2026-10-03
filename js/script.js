const nutAmThanh = document.getElementById("nut-am-thanh"); /* hang: 1 gia tri co dinh va ko thay doi */
const videoNen = document.getElementById("video-nen");
const moTaCanh = document.getElementById("mo-ta-canh");
const amThanhA = document.getElementById("am-thanh-a");
const amThanhB = document.getElementById("am-thanh-b");

let amLuong = 0.5; /* bien: 1 gia tri duoc khai bao co the thay doi */
let amDangPhat = amThanhA;
let amKeTiep = amThanhB;
let dangBatAmThanh = false;
let dangChuyenAm = false;
let boDemKiemTra;
let boDemChuyenAm;

// /* ham batTatAmThanh: xem am thanh co dang duoc phat hay khong neu khong thi se bat
// am thanh va thay doi content tren nut bat am thanh va nguoc lai */
// async function batTatAmThanh(){ /* function: giup lien ket 1 ham voi nhung chuc nang da code de co the khai bao */
//     if(!dangBatAmThanh){
//         dangBatAmThanh=true;
//         amDangPhat.currentTime=0;
//         amDangPhat.volume=amLuong;
//         await amDangPhat.play();
//         batDauKiemTraAmThanh();
//         nutAmThanh.textContent="II Tạm dừng âm thanh";
//     }else{
//         tatAmThanh();
//         nutAmThanh.textContent="▶ Bật tiếng thác nước";
//     }
// }

/* ham batTatAmThanh: kiem tra va thay doi trang thai am thanh */
let lanPhat = 0;
async function batTatAmThanh() {
    if (dangBatAmThanh) {
        tatAmThanh();
        return;
    }
    dangBatAmThanh = true;
    const lanHienTai = ++lanPhat;
    if (amDangPhat.ended) amDangPhat.currentTime = 0;
    amDangPhat.volume = amLuong;
    nutAmThanh.textContent = "Ⅱ Tạm dừng âm thanh";
    try {
        await amDangPhat.play();
        if (lanHienTai !== lanPhat || !dangBatAmThanh) return;
        batDauKiemTraAmThanh();
    } catch (error) {
        if (lanHienTai !== lanPhat) return;
        tatAmThanh();
        console.error("Không thể phát âm thanh:", error);
    }
}
function tatAmThanh() {
    dangBatAmThanh = false;
    lanPhat++;
    clearInterval(boDemKiemTra);
    clearInterval(boDemChuyenAm);
    amThanhA.pause();
    amThanhB.pause();
    dangChuyenAm = false;
    amDangPhat.volume = amLuong;
    amKeTiep.volume = 0;
    nutAmThanh.textContent = "▶ Bật tiếng thác nước";
}

/* ham doiAmLuong: cho phep minh thay doi gia tri gan voi am luong cua am thanh */
function doiAmLuong(giaTri){
    amLuong=Number(giaTri);
    if(!dangChuyenAm){
        amDangPhat.volume=amLuong
    }
}

/* ham batDauKiemTraAmThanh: kiem tra thoi gian con lai cua am thanh dang phat neu be hon 2
thi se chuyen sang am thanh tiep theo */
function batDauKiemTraAmThanh(){
    clearInterval(boDemKiemTra);
    boDemKiemTra=setInterval(function(){
        const thoiGianConLai=amDangPhat.duration-amDangPhat.currentTime;
        if(!dangChuyenAm && thoiGianConLai <= 2){
            chuyenAmThanh();
        }
    }, 100);
}

/* ham chuyenAmThanh: la ham chuyen am thanh, neu chuyen am thanh thi dat thoi gian cho am thanh tiep theo
la 0 va am luong la 0 (khi gan ket thuc am thanh thi am luong se nho dan va khi bat dau am thanh tiep theo
 se tang dan am luong)  */
function chuyenAmThanh(){
    dangChuyenAm=true;
    amKeTiep.currentTime=0;
    amKeTiep.volume=0;
    amKeTiep.play()
    let buoc=0;
    const tongBuoc=20;
    boDemChuyenAm=setInterval(function(){
        buoc++; /* buoc = buoc + 1; buoc = 1 */
        const title=buoc/tongBuoc; /* b1: title = 1/20 */
        amDangPhat.volume=amLuong*(1-title); /* b1: 0,475; b2: 0.45; b3: 0.425; b4: 0.4; b5: 0.375;...; b20: 0 */
        amKeTiep.volume=amLuong*title; /* b1 = 0.025; b2 = 0.050; b3 = 0.075; b4 = 0.1; b5 = 0.125;...; b20 = 0.5 */
        if(buoc>=tongBuoc){
            clearInterval(boDemChuyenAm);
            amDangPhat.pause();
            amDangPhat.currentTime=0;
            const amTam = amDangPhat;
            amDangPhat = amKeTiep;
            amKeTiep = amTam;
            dangChuyenAm=false;
        }
    }, 100);
}
