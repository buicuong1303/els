/* eslint-disable @nrwl/nx/enforce-module-boundaries */

import { Injectable, Logger } from '@nestjs/common';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import { SpeechSynthesizer } from 'microsoft-cognitiveservices-speech-sdk';
import { MinIoService } from '../min-io';
@Injectable()
export class TextToSpeechService {
  private readonly _logger = new Logger(TextToSpeechService.name);
  private speechConfig = sdk.SpeechConfig.fromSubscription(
    process.env.AZURE_SPEECH_KEY || '',
    process.env.AZURE_SPEECH_REGION || ''
  );
  private voicesMap = new Map([
    //TODO design db to manage
    [
      'en-US',
      [
        'en-US-JennyNeural',
        'en-US-BrandonNeural',
        'en-US-EricNeural',
        'en-US-AshleyNeural',
      ],
    ],
  ]);
  constructor(private readonly _minIoService: MinIoService) {}

  async textToSpeech(text: string, prefix: string, lang = 'en-US'): Promise<any> {
    this.speechConfig.speechSynthesisLanguage = lang; // For example, "de-DE"
    const synthesizer = new SpeechSynthesizer(this.speechConfig);
    const voices = this.voicesMap.get(lang);
    if (voices && voices.length > 0) {
      //* radom voice
      this.speechConfig.speechSynthesisVoiceName =
        voices[Math.floor(Math.random() * voices.length)];
    }
    const speakTextPromise = (text: string, prefix: string) => {
      return new Promise((resolve, reject) => {
        synthesizer.speakTextAsync(
          text,
          async (result) => {
            const { audioData } = result;
            if (!audioData) return reject(`can not get audio for ${text}`);
            //* covert to array buffer
            const buffer = Buffer.from(new Uint8Array(audioData));
            //* upload file to minio
            await this._minIoService.uploadFile(process.env.MINIO_BUCKET_NAME || '', `${prefix}/${text.trim().replace(/\s/g, '_')}.mp3`, 'audio/mpeg',  buffer);
            synthesizer.close();
            return  resolve(`${process.env.MINIO_PUBLIC_HOST}/${process.env.MINIO_BUCKET_NAME}/${prefix}/${text.replace(/\s/g, '_')}.mp3`);
          },
          (error) => {
            console.log(error);
            synthesizer.close();
            reject(error);
          }
        );
      });
    };
    return speakTextPromise(text, prefix);
    // synthesizer.speakTextAsync(
    //   text,
    //   async (result) => {
    //     const { audioData } = result;
    //     await this._minIoService.uploadFile(`${text}.mp3`, audioData); 
    //     synthesizer.close();
    //     return `http://localhost:9000/resources/${text}.mp3`;
    //   },
    //   (error) => {
    //     console.log(error);
    //     synthesizer.close();
    //   }
    // );
  }

  async sentenceToSpeech(
    sentence: string,
    dir: string,
    fileName: string,
    lang = 'en-US'
  ): Promise<any> {
    this.speechConfig.speechSynthesisLanguage = lang; // For example, "de-DE"
    const synthesizer = new SpeechSynthesizer(this.speechConfig);
    const voices = this.voicesMap.get(lang);
    if (voices && voices.length > 0) {
      this.speechConfig.speechSynthesisVoiceName =
        voices[Math.floor(Math.random() * voices.length)];
    }
    const speakTextPromise = (sentence: string) => {
      return new Promise((resolve, reject) => {
        synthesizer.speakTextAsync(
          sentence,
          async (result) => {
            const { audioData } = result;
            const buffer = Buffer.from(new Uint8Array(audioData));
            await this._minIoService.uploadFile(dir, `${fileName}.mp3`, 'audio/mpeg', buffer);
            synthesizer.close();
            resolve(`${process.env.MINIO_PUBLIC_HOST}/audio/${fileName}.mp3`);
          },
          (error) => {
            console.log(error);
            synthesizer.close();
            reject(error);
          }
        );
      });
    };
    return speakTextPromise(sentence);
    // synthesizer.speakTextAsync(
    //   text,
    //   async (result) => {
    //     const { audioData } = result;
    //     await this._minIoService.uploadFile(`${text}.mp3`, audioData);
    //     synthesizer.close();
    //     return `http://localhost:9000/resources/${text}.mp3`;
    //   },
    //   (error) => {
    //     console.log(error);
    //     synthesizer.close();
    //   }
    // );
  }
}
