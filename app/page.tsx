"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  CakeSlice,
  Check,
  Heart,
  Music2,
  Pause,
  RotateCcw,
  Share2,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useRef, useState } from "react";
import { birthdayConfig } from "@/lib/birthday-config";

const scenes = ["A little surprise", "The big day", "A note for you", "Little memories", "One more thing"];
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function publicAsset(src: string) {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(src)) return src;
  return `${basePath}${src.startsWith("/") ? src : `/${src}`}`;
}

export default function Home() {
  const [scene, setScene] = useState(0);
  const [celebrated, setCelebrated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const reduceMotion = useReducedMotion();
  const name = birthdayConfig.recipientName.trim() || "you";
  const firstName = name.split(/\s+/)[0];
  const transition = reduceMotion ? { duration: 0 } : { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const };

  const go = (next: number) => {
    setScene(Math.max(0, Math.min(scenes.length - 1, next)));
    window.scrollTo({ top: 0, behavior: reduceMotion ? "instant" : "smooth" });
  };

  const toggleMusic = async () => {
    if (!birthdayConfig.musicUrl || !audioRef.current) return;
    if (musicOn) {
      audioRef.current.pause();
      setMusicOn(false);
    } else {
      try {
        await audioRef.current.play();
        setMusicOn(true);
      } catch {
        setMusicOn(false);
      }
    }
  };

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: `A birthday wish for ${name}`, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2200);
      }
    } catch {
      // Sharing can be dismissed by the visitor; keep the experience in place.
    }
  };

  return (
    <main className={`experience theme-${birthdayConfig.theme ?? "midnight"}`}>
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <div className="starfield" aria-hidden="true">
        {Array.from({ length: 28 }, (_, i) => <span key={i} className={`star star-${i % 7}`} style={{ left: `${(i * 37 + 11) % 100}%`, top: `${(i * 53 + 8) % 100}%`, animationDelay: `${(i % 9) * -0.7}s` }} />)}
      </div>

      <header className="topbar">
        <a className="wordmark" href="#top" onClick={(event) => { event.preventDefault(); go(0); }} aria-label="Return to the beginning">
          <span className="wordmark-mark"><Sparkles size={15} strokeWidth={1.5} /></span>
          <span>a little wonder</span>
        </a>
        <div className="topbar-right">
          {birthdayConfig.musicUrl && <div className="music-controls"><button className="icon-button music-toggle" onClick={toggleMusic} aria-label={musicOn ? "Pause music" : "Play music"}>{musicOn ? <Pause size={16} /> : <Music2 size={16} />}<span>{musicOn ? "Pause" : "Music"}</span></button><button className="icon-button mute-toggle" onClick={() => { const nextMuted = !muted; setMuted(nextMuted); if (audioRef.current) audioRef.current.muted = nextMuted; }} aria-label={muted ? "Unmute music" : "Mute music"}>{muted ? <VolumeX size={15} /> : <Volume2 size={15} />}</button></div>}
          <div className="occasion-pill"><span className="live-dot" /> MADE JUST FOR YOU</div>
        </div>
      </header>
      {birthdayConfig.musicUrl && <audio ref={audioRef} src={birthdayConfig.musicUrl} loop preload="none" />}

      <nav className="progress" aria-label="Experience progress">
        {scenes.map((label, index) => <button key={label} className={`progress-step ${scene === index ? "active" : ""} ${scene > index ? "complete" : ""}`} onClick={() => go(index)} aria-label={`Go to ${label}`} aria-current={scene === index ? "step" : undefined}><span className="progress-dot">{scene > index ? <Check size={11} /> : `0${index + 1}`}</span><span className="progress-label">{label}</span></button>)}
        <span className="progress-line" aria-hidden="true"><span style={{ width: `${(scene / (scenes.length - 1)) * 100}%` }} /></span>
      </nav>

      <AnimatePresence mode="wait">
        <motion.section key={scene} className="scene" id="top" initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduceMotion ? 0 : -10 }} transition={transition}>
          {scene === 0 && <WelcomeScene name={name} onOpen={() => go(1)} />}
          {scene === 1 && <BirthdayScene name={name} firstName={firstName} celebrated={celebrated} onCelebrate={() => setCelebrated(true)} onNext={() => go(2)} />}
          {scene === 2 && <MessageScene firstName={firstName} onNext={() => go(3)} />}
          {scene === 3 && <MemoriesScene name={name} onNext={() => go(4)} />}
          {scene === 4 && <FinalScene name={name} copied={copied} onShare={share} onReplay={() => { setCelebrated(false); setCopied(false); if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; setMusicOn(false); } go(0); }} />}
        </motion.section>
      </AnimatePresence>

      <footer className="footer"><span>AN UNEXPECTED LITTLE MOMENT</span><span className="footer-heart"><Heart size={11} fill="currentColor" /> WITH LOVE</span></footer>
    </main>
  );
}

function WelcomeScene({ name, onOpen }: { name: string; onOpen: () => void }) {
  return <div className="welcome scene-inner">
    <div className="eyebrow"><span className="eyebrow-line" /> A MOMENT, JUST FOR YOU <span className="eyebrow-line" /></div>
    <motion.div className="orbit-art" initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.1, ease: "easeOut" }} aria-hidden="true">
      <div className="orbit orbit-a" /><div className="orbit orbit-b" /><div className="orbit orbit-c" />
      <div className="moon"><span className="moon-glint" /><span className="moon-glint second" /><Sparkles size={17} className="moon-spark" /></div>
      <div className="orbit-speck speck-a" /><div className="orbit-speck speck-b" /><div className="orbit-speck speck-c" />
    </motion.div>
    <motion.p className="small-kicker" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>THERE&apos;S SOMETHING WAITING FOR YOU</motion.p>
    <motion.h1 className="hero-title" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32, duration: 0.75 }}>Some days are<br />made to <em>shine.</em></motion.h1>
    <motion.p className="hero-copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.58, duration: 0.7 }}>And this one has your name written all over it, {name}.</motion.p>
    <motion.button className="primary-button" onClick={onOpen} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}><span>Open your surprise</span><ArrowRight size={17} strokeWidth={1.7} /></motion.button>
    <div className="welcome-note"><span className="note-star">✳</span> BEST OPENED WITH A LITTLE CURIOSITY <span className="note-star">✳</span></div>
  </div>;
}

function BirthdayScene({ name, firstName, celebrated, onCelebrate, onNext }: { name: string; firstName: string; celebrated: boolean; onCelebrate: () => void; onNext: () => void }) {
  const [photoFailed, setPhotoFailed] = useState(false);
  return <div className="birthday-layout scene-inner">
    <div className="birthday-copy">
      <div className="eyebrow left"><span className="eyebrow-line" /> THE DAY IS YOURS</div>
      <p className="small-kicker">A LITTLE OLDER, A LOT MORE <span className="gold-text">GOLDEN</span></p>
      <h1 className="birthday-title">Happy birthday,<br /><em>{firstName}.</em></h1>
      <p className="birthday-desc">Today, the universe gets to celebrate the wonderful person you are.</p>
      <div className="birthday-actions">
        <motion.button className={`primary-button ${celebrated ? "celebrated" : ""}`} onClick={onCelebrate} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}><CakeSlice size={17} strokeWidth={1.6} /><span>{celebrated ? "Wish sent into the universe" : "Make a birthday wish"}</span><Sparkles size={15} /></motion.button>
        <button className="text-button" onClick={onNext}>A note for you <ArrowRight size={15} /></button>
      </div>
      <div className="birthday-meta"><span className="meta-rule" />{birthdayConfig.birthdayDate ? `CELEBRATING ${birthdayConfig.birthdayDate}` : "ANOTHER BEAUTIFUL CHAPTER BEGINS"}</div>
    </div>
    <div className={`portrait-wrap ${celebrated ? "portrait-celebrated" : ""}`}>
      <div className="portrait-orbit" aria-hidden="true" /><div className="portrait-frame">
        {!photoFailed ? <Image src={publicAsset(birthdayConfig.recipientPhoto)} alt={`A photo of ${name}`} fill priority sizes="(max-width: 700px) 78vw, 370px" className="portrait-image" onError={() => setPhotoFailed(true)} /> : <div className="photo-placeholder"><div className="placeholder-symbol"><Sparkles size={26} /></div><span>YOUR PHOTO<br />GOES HERE</span><small>Replace recipientPhoto in<br />lib/birthday-config.ts</small></div>}
        <div className="portrait-vignette" />
      </div>
      <div className="portrait-caption"><span>THE WORLD IS LUCKIER WITH YOU IN IT</span><Heart size={12} fill="currentColor" /></div>
      <span className="portrait-number">01 / 04</span>
      {celebrated && <div className="spark-burst" aria-hidden="true">{Array.from({ length: 10 }, (_, i) => <i key={i} style={{ "--i": i } as React.CSSProperties}>✦</i>)}</div>}
    </div>
  </div>;
}

function MessageScene({ firstName, onNext }: { firstName: string; onNext: () => void }) {
  return <div className="message-scene scene-inner">
    <div className="eyebrow"><span className="eyebrow-line" /> THE PART THAT MATTERS MOST <span className="eyebrow-line" /></div>
    <div className="letter-card">
      <div className="letter-top"><span className="letter-seal"><Heart size={14} fill="currentColor" /></span><span>A FEW WORDS, FROM THE HEART</span><span className="letter-date">WITH LOVE · ALWAYS</span></div>
      <div className="letter-content"><p className="letter-salutation">Dear {firstName},</p><div className="letter-rule" /><p className="letter-body">{birthdayConfig.message}</p><div className="letter-signoff">Here&apos;s to you,<br /><em>{birthdayConfig.senderName || "With love"}</em></div></div>
      <div className="letter-bottom"><span>MADE JUST FOR YOU</span><span className="letter-bottom-flower">✳</span><span>OPEN WHENEVER YOU NEED A SMILE</span></div>
    </div>
    <motion.button className="primary-button" onClick={onNext} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}><span>One last little thing</span><ArrowRight size={17} /></motion.button>
  </div>;
}

function FinalScene({ name, copied, onShare, onReplay }: { name: string; copied: boolean; onShare: () => void; onReplay: () => void }) {
  return <div className="final-scene scene-inner">
    <div className="eyebrow"><span className="eyebrow-line" /> BEFORE YOU GO <span className="eyebrow-line" /></div>
    <div className="final-sun" aria-hidden="true"><span /><span /><Sparkles size={21} /></div>
    <p className="small-kicker">THE GOOD THINGS ARE JUST GETTING STARTED</p>
    <h1 className="final-title">Keep being<br /><em>your kind of magic.</em></h1>
    <p className="final-copy">The candles go out. The good wishes stay.<br />Have the happiest birthday, {name}.</p>
    <div className="final-actions"><motion.button className="primary-button" onClick={onShare} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}><span>{copied ? "Link copied" : "Share this little wonder"}</span>{copied ? <Check size={17} /> : <Share2 size={16} />}</motion.button><button className="replay-button" onClick={onReplay}><RotateCcw size={14} /> Take me back to the beginning</button></div>
    <div className="final-signature"><span className="signature-rule" />WITH LOVE, ALWAYS<span className="signature-rule" /></div>
    <div className="final-bloom" aria-hidden="true">✳</div>
  </div>;
}

function MemoriesScene({ name, onNext }: { name: string; onNext: () => void }) {
  const photos = [birthdayConfig.recipientPhoto, ...(birthdayConfig.additionalPhotos ?? []).filter(Boolean)];
  const [failedPhotos, setFailedPhotos] = useState<string[]>([]);
  const markFailed = (src: string) => setFailedPhotos((current) => current.includes(src) ? current : [...current, src]);
  return <div className="memories-scene scene-inner">
    <div className="eyebrow"><span className="eyebrow-line" /> THE LITTLE THINGS STAY WITH US <span className="eyebrow-line" /></div>
    <p className="small-kicker">A PLACE FOR THE MOMENTS THAT MAKE YOU, YOU</p>
    <h1 className="memories-title">A life full of<br /><em>lovely little things.</em></h1>
    {photos.length > 1 ? <div className="memory-gallery">{photos.map((src, index) => <div className={`memory-tile tile-${index % 3}`} key={`${src}-${index}`}><div className="memory-image">{!failedPhotos.includes(src) ? <Image src={publicAsset(src)} alt={`${name}, memory ${index + 1}`} fill sizes="(max-width: 700px) 85vw, 32vw" onError={() => markFailed(src)} /> : <PhotoFallback name={name} />}</div><span className="memory-caption">A MOMENT TO KEEP <span>0{index + 1}</span></span></div>)}</div> : <div className="single-memory"><div className="single-memory-frame"><div className="memory-image">{!failedPhotos.includes(photos[0]) ? <Image src={publicAsset(photos[0])} alt={`A photo of ${name}`} fill sizes="(max-width: 700px) 86vw, 440px" onError={() => markFailed(photos[0])} /> : <PhotoFallback name={name} />}</div></div><div className="single-memory-note"><span className="memory-note-star">✳</span><span>THE BEST MEMORIES AREN&apos;T ALWAYS IN PHOTOS.<br />SOME LIVE IN THE WAY YOU MAKE PEOPLE FEEL.</span></div></div>}
    <motion.button className="primary-button" onClick={onNext} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}><span>One last little thing</span><ArrowRight size={17} /></motion.button>
  </div>;
}

function PhotoFallback({ name }: { name: string }) {
  return <div className="memory-fallback"><Sparkles size={22} /><span>{name}</span><small>ADD A PHOTO IN<br />lib/birthday-config.ts</small></div>;
}
