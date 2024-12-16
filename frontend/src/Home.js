import React, { useState } from 'react';
import './Home.css';

const Home = () => {
  const [storyPrompt, setStoryPrompt] = useState('');
  const [wordCount, setWordCount] = useState('');
  const [genre, setGenre] = useState('');
  const [generatedStory, setGeneratedStory] = useState([]);
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Function to generate story
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!storyPrompt || !wordCount || !genre) {
      alert('Please fill out all fields.');
      return;
    }

    const inputData = `Title:${storyPrompt} Genre:${genre}`;

    setLoading(true);

    try {
      const response = await fetch("https://6666-34-148-28-250.ngrok-free.app", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ input: inputData }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate the story");
      }

      const data = await response.json();
      setGeneratedStory((prevStory) => [
        ...prevStory,
        { prompt: inputData, story: data },
      ]);
    } catch (error) {
      console.error("Error generating story:", error);
      alert('An error occurred while generating the story. Please try again.');
    } finally {
      setLoading(false);
      setStoryPrompt('');
      setWordCount('');
      setGenre('');
    }
  };

  /// Function to play story using Web Speech API
  const playStoryReadout = () => {
    if (generatedStory.length === 0 || !generatedStory[generatedStory.length - 1].story) {
      alert('No story has been generated yet.');
      return;
    }

    const lastStory = generatedStory[generatedStory.length - 1].story;
    const textForAudio = lastStory.map(scene => scene.scene).join(' ');

    const voices = speechSynthesis.getVoices();
    const indianFemaleEnglishVoice = voices.find(voice => voice.name === 'Google UK English Female');

    // Initialize the SpeechSynthesis API
    const utterance = new SpeechSynthesisUtterance(textForAudio);

    if (indianFemaleEnglishVoice) {
      utterance.voice = indianFemaleEnglishVoice;
    }

    // Optional: Set the language and voice properties
    utterance.lang = 'en-IN'; // English language
    utterance.rate = 1; // Speed of speech (1 is normal)
    utterance.pitch = 1.2; // Pitch of the voice (1 is normal)

    // Speak the text
    speechSynthesis.speak(utterance);

    // Track if it's currently speaking
    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    // Reset the flag when done speaking
    utterance.onend = () => {
      setIsSpeaking(false);
    };
  };

  // Function to stop speech synthesis (if needed)
  const stopStoryReadout = () => {
    speechSynthesis.cancel(); // Stops any ongoing speech
    setIsSpeaking(false);
  };

  return (
    <div className="page-container">
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter your story prompt here..."
          value={storyPrompt}
          onChange={(e) => setStoryPrompt(e.target.value)}
          className="prompt-input"
        />
        <div className="controls">
          <select onChange={(e) => setGenre(e.target.value)} className="genre-select">
            <option value="">Genre</option>
            <option value="horror">Horror</option>
            <option value="moral">Moral</option>
            <option value="folk-tales">Folk Tales</option>
            <option value="mythology">Mythology</option>
            <option value="fairy-tales">Fairy Tales</option>
            <option value="general">General</option>
            <option value="fantasy">Fantasy</option>
            <option value="adventureous">Adventureous</option>
            <option value="Romantic">Romantic</option>
          </select>
          <input
            type="number"
            placeholder="Word Count"
            value={wordCount}
            onChange={(e) => setWordCount(e.target.value)}
            className="word-count-input"
          />
          <button onClick={handleSubmit} className="generate-button">
            {loading ? 'Generating...' : 'Generate Story'}
          </button>
        </div>
      </div>

      {/* Story Display Container */}
      {generatedStory.length > 0 && (
        <div className="story-display-container">
          {generatedStory.map((story, index) => (
            <div key={index} className="story-bubble">
              <h2>Generated Story</h2>
              <div className="story-content">
                {story.story.map((scene, sceneIndex) => (
                  <div key={sceneIndex} className="scene">
                    <p>{scene.scene}</p>
                    {scene.image && (
                      <img
                        src={`data:image/png;base64,${scene.image}`}
                        alt={`Scene ${sceneIndex + 1}`}
                        className="scene-image"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Audio Button */}
      {generatedStory.length > 0 && (
        <button onClick={playStoryReadout} className="audio-button" disabled={isSpeaking}>
          {isSpeaking ? 'Stop Audio' : 'Play Audio Readout'}
        </button>
      )}
    </div>
  );
};

export default Home;
