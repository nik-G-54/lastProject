import React from 'react'
import { useEffect, useRef, useState } from 'react';
import { connectWS } from './ws';
import uploadImage from '../utils/uploadImage';
import Navbar from "../Scomponent/Navbar"
const Groupchat = () => {




     const timer = useRef(null);
    const socket = useRef(null);
    const bottomRef = useRef(null);
    const [userName, setUserName] = useState('');
    const [showNamePopup, setShowNamePopup] = useState(true);
    const [inputName, setInputName] = useState('');
    const [typers, setTypers] = useState([]);

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');

    useEffect(() => {
        socket.current = connectWS();

        socket.current.on('connect', () => {
            // request persisted history when connected
            socket.current.emit('requestHistory');

            socket.current.on('roomNotice', (userName) => {
                console.log(`${userName} joined to group!`);
            });

            socket.current.on('chatMessage', (msg) => {
                // push to existing messages list
                console.log('msg', msg);
                setMessages((prev) => [...prev, msg]);
            });

            socket.current.on('history', (items) => {
                // normalize to expected client shape
                const normalized = items.map((it) => ({
                    id: it._id || it.id || Date.now() + Math.random(),
                    sender: it.sender,
                    text: it.text || '',
                    imageUrl: it.imageUrl || '',
                    ts: it.createdAt ? new Date(it.createdAt).getTime() : it.ts || Date.now(),
                }));
                setMessages(normalized);
            });

            socket.current.on('chatAck', (msg) => {
                // replace optimistic message with saved one (by id if we ever map)
                setMessages((prev) => [...prev, msg]);
            });

            // when a message is deleted elsewhere, remove it locally
            socket.current.on('messageDeleted', ({ id }) => {
                setMessages((prev) => prev.filter((m) => m.id !== id));
            });

            socket.current.on('typing', (userName) => {
                setTypers((prev) => {
                    const isExist = prev.find((typer) => typer === userName);
                    if (!isExist) {
                        return [...prev, userName];
                    }

                    return prev;
                });
            });

            socket.current.on('stopTyping', (userName) => {
                setTypers((prev) => prev.filter((typer) => typer !== userName));
            });
        });

        return () => {
            socket.current.off('roomNotice');
            socket.current.off('chatMessage');
            socket.current.off('typing');
            socket.current.off('stopTyping');
            socket.current.off('history');
            socket.current.off('chatAck');
            socket.current.off('messageDeleted');
        };
    }, []);

    useEffect(() => {
        if (text) {
            socket.current.emit('typing', userName);
            clearTimeout(timer.current);
        }

        timer.current = setTimeout(() => {
            socket.current.emit('stopTyping', userName);
        }, 1000);

        return () => {
            clearTimeout(timer.current);
        };
    }, [text, userName]);

    // AUTO SCROLL TO LATEST MESSAGE WHENEVER MESSAGES UPDATE
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // FORMAT TIMESTAMP TO HH:MM FOR MESSAGES
    function formatTime(ts) {
        const d = new Date(ts);
        const hh = String(d.getHours()).padStart(2, '0');
        const mm = String(d.getMinutes()).padStart(2, '0');
        return `${hh}:${mm}`;
    }

    // SUBMIT NAME TO GET STARTED, OPEN CHAT WINDOW WITH INITIAL MESSAGE
    function handleNameSubmit(e) {
        e.preventDefault();
        const trimmed = inputName.trim();
        if (!trimmed) return;

        // join room
        socket.current.emit('joinRoom', trimmed);

        setUserName(trimmed);
        setShowNamePopup(false);
    }

    // SEND MESSAGE FUNCTION
    function sendMessage() {
        const t = text.trim();
        if (!t) return;

        // USER MESSAGE
        const msg = {
            id: Date.now(),
            sender: userName,
            text: t,
            ts: Date.now(),
        };
        setMessages((m) => [...m, msg]);

        // emit to persist/broadcast
        socket.current.emit('chatMessage', msg);

        setText('');
    }

    async function sendImage(file) {
        if (!file || !userName) return;
        try {
            const { imageUrl } = await uploadImage(file);
            const msg = {
                id: Date.now(),
                sender: userName,
                text: '',
                imageUrl,
                ts: Date.now(),
            };
            setMessages((m) => [...m, msg]);
            socket.current.emit('chatMessage', msg);
        } catch (e) {
            console.error('Image upload failed', e);
        }
    }

    // HANDLE ENTER KEY TO SEND MESSAGE
    function handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }

    // DELETE MESSAGE (only local author gets button)
    function deleteMessage(id) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        try {
            socket.current.emit('deleteMessage', { id });
        } catch (e) {
            // ignore if ws not connected; local delete already applied
            console.log(e)
        }
    }
  return (
    <div>
       <Navbar />
       <div className="min-h-screen flex items-center justify-center bg-zinc-100 p-4 font-inter">
            {/* ENTER YOUR NAME TO START CHATTING */}
            {showNamePopup && (
                <div className="fixed inset-0 flex items-center justify-center z-40">
                    <div className="bg-white rounded-xl shadow-lg max-w-md p-6">
                        <h1 className="text-xl font-semibold text-black">Enter your name</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Enter your name to start chatting. This will be used to identify
                        </p>
                        <form onSubmit={handleNameSubmit} className="mt-4">
                            <input
                                autoFocus
                                value={inputName}
                                onChange={(e) => setInputName(e.target.value)}
                                className="w-full border border-gray-200 rounded-md px-3 py-2 outline-green-500 placeholder-gray-400"
                                placeholder="Your name (e.g. John Doe)"
                            />
                            <button
                                type="submit"
                                className="block ml-auto mt-3 px-4 py-1.5 rounded-full bg-green-500 text-white font-medium cursor-pointer">
                                Continue
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* CHAT WINDOW */}
            {!showNamePopup && (
                <div className="w-full max-w-2xl h-[90vh] bg-white rounded-xl shadow-md flex flex-col overflow-hidden">
                    {/* CHAT HEADER */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
                        <div className="h-10 w-10 rounded-full bg-[#075E54] flex items-center justify-center text-white font-semibold">
                            R
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-medium text-[#303030]">
                                Realtime group chat
                            </div>

                            {typers.length ? (
                                <div className="text-xs text-gray-500">
                                    {typers.join(', ')} is typing...
                                </div>
                            ) : (
                                ''
                            )}
                        </div>
                        <div className="text-sm text-gray-500">
                            Signed in as{' '}
                            <span className="font-medium text-[#303030] capitalize">
                                {userName}
                            </span>
                        </div>
                    </div>

                    {/* CHAT MESSAGE LIST */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-100 flex flex-col">
                        {messages.map((m) => {
                            const mine = m.sender === userName;
                            return (
                                <div
                                    key={m.id}
                                    className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                                    <div
                                        className={`max-w-[78%] p-3 my-2 rounded-[18px] text-sm leading-5 shadow-sm ${
                                            mine
                                                ? 'bg-[#DCF8C6] text-[#303030] rounded-br-2xl'
                                                : 'bg-white text-[#303030] rounded-bl-2xl'
                                        }`}>
                                        {m.imageUrl ? (
                                            <img src={m.imageUrl} alt="shared" className="rounded-md mb-2 max-h-64 object-contain" />
                                        ) : null}
                                        {m.text ? (
                                            <div className="break-words whitespace-pre-wrap">{m.text}</div>
                                        ) : null}
                                        <div className="flex justify-between items-center mt-1 gap-16">
                                            <div className="text-[11px] font-bold">{m.sender}</div>
                                            <div className="text-[11px] text-gray-500 text-right">
                                                {formatTime(m.ts)}
                                            </div>
                                        </div>
                                        {mine ? (
                                            <div className="flex justify-end mt-1">
                                                <button
                                                    onClick={() => deleteMessage(m.id)}
                                                    className="text-[11px] text-red-600 hover:underline">
                                                    Delete
                                                </button>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={bottomRef} />
                    </div>

                    {/* CHAT TEXTAREA */}
                    <div className="px-4 py-3 border-t border-gray-200 bg-white">
                        <div className="flex items-center justify-between gap-4 border border-gray-200 rounded-full">
                            <label className="px-3 cursor-pointer" title="Send image">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files && e.target.files[0];
                                        if (file) sendImage(file);
                                        e.target.value = '';
                                    }}
                                />
                                <span className="text-green-600 font-medium">📎</span>
                            </label>
                            <textarea
                                rows={1}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type a message..."
                                className="w-full resize-none px-4 py-4 text-sm outline-none"
                            />
                            <button
                                onClick={sendMessage}
                                className="bg-green-500 text-white px-4 py-2 mr-2 rounded-full text-sm font-medium cursor-pointer">
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    


    </div>
  )
}

export default Groupchat
