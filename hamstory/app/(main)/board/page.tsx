"use client";

import { useEffect, useRef, useState } from "react";

export default function BoardPage() {
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<RTCDataChannel | null>(null);
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => setLog((prev) => [...prev, msg]);

  async function start() {
    // 1. PeerConnection 생성
    peerRef.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    // 2. DataChannel 생성
    channelRef.current = peerRef.current.createDataChannel("chat");
    channelRef.current.onmessage = (e) => addLog("상대: " + e.data);

    // 3. ICE candidate 감지
    peerRef.current.onicecandidate = async (event) => {
      if (event.candidate) {
        await fetch("/api/signal", {
          method: "POST",
          body: JSON.stringify({ ice: event.candidate }),
          headers: { "Content-Type": "application/json" },
        });
      }
    };

    // 4. Offer SDP 생성
    const offer = await peerRef.current.createOffer();
    await peerRef.current.setLocalDescription(offer);

    // signaling 서버로 전송
    await fetch("/api/signal", {
      method: "POST",
      body: JSON.stringify({ offer }),
      headers: { "Content-Type": "application/json" },
    });

    addLog("Offer 전송됨");
  }

  async function connect() {
    // 1) 서버에서 offer 가져오기
    const msgs = await fetch("/api/signal").then((r) => r.json());
    const offerMsg = msgs.find((m: any) => m.offer);

    // 2) Peer 생성
    peerRef.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerRef.current.ondatachannel = (e) => {
      channelRef.current = e.channel;
      channelRef.current.onmessage = (ev) => addLog("상대: " + ev.data);
    };

    peerRef.current.onicecandidate = async (event) => {
      if (event.candidate) {
        await fetch("/api/signal", {
          method: "POST",
          body: JSON.stringify({ ice: event.candidate }),
          headers: { "Content-Type": "application/json" },
        });
      }
    };

    // 3) Offer 설정
    await peerRef.current.setRemoteDescription(offerMsg.offer);

    // 4) Answer 생성 및 서버에 저장
    const answer = await peerRef.current.createAnswer();
    await peerRef.current.setLocalDescription(answer);

    await fetch("/api/signal", {
      method: "POST",
      body: JSON.stringify({ answer }),
      headers: { "Content-Type": "application/json" },
    });

    addLog("Answer 전송됨");
  }

  async function receive() {
    const msgs = await fetch("/api/signal").then((r) => r.json());

    const answerMsg = msgs.find((m: any) => m.answer);
    const iceMsgs = msgs.filter((m: any) => m.ice);

    if (answerMsg && peerRef.current) {
      await peerRef.current.setRemoteDescription(answerMsg.answer);
      addLog("Answer 적용됨");
    }

    for (const m of iceMsgs) {
      try {
        await peerRef.current?.addIceCandidate(m.ice);
      } catch {}
    }
  }

  function sendMessage() {
    const msg = "hello webRTC!";
    channelRef.current?.send(msg);
    addLog("나: " + msg);
  }

  return (
    <div>
      <button
        onClick={start}
        style={{ width: "160px", border: "1px solid #ffeeee" }}
      >
        나는 Host (Offer)
      </button>
      <button
        onClick={connect}
        style={{ width: "160px", border: "1px solid #ffeeee" }}
      >
        나는 Guest (Answer)
      </button>
      <button
        onClick={receive}
        style={{ width: "160px", border: "1px solid #ffeeee" }}
      >
        Signaling 수신
      </button>
      <button
        onClick={sendMessage}
        style={{ width: "160px", border: "1px solid #ffeeee" }}
      >
        메시지 보내기
      </button>

      <div style={{ marginTop: 20 }}>
        <h3>Log</h3>
        {log.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
    </div>
  );
}
