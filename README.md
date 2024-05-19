# Voice Activity Detection 

## Приложение для определения голосовой активности для обучения студентов (итоговое задание дисциплины "Компьютерные технологии обработки аудиоданных")

Для работы программы нужен звуковой файл в формате Waveform Audio File Format (WAV). К файлу предъявляются следующие требования:
- Частота дискретизации: 8000 Гц
- Количество каналов: 1 (моно)
С отличными от требований файлами программа может работать некорректно!

Сначала программа предлагает выбрать аудио-файл. Можно воспользоваться Drag and Drop и перетащить выбранный аудио-файл. При необходимости можно воспользоваться проводником. Выбор файла можно отменить с помощью соответствующей кнопки.

После выбора файла произойдёт переход к основному окну работы программы. 
Окно программы состоит из: 
- Поле с характеристиками файла
- Осциллограмма звука с выделением речи/паузы
- Кнопки действия

Параметры алгоритма: 
- Размер окна - размер участков, но которые будет разбит аудио-файл
- Коэффициент k - параметр "агрессивности" алгоритма

После подбора необходимых параметров результат можно прослушать как с паузами, так и без них. За этот функционал отвечает флажок "Проиграть без пауз". После настройки алгоритма можно скачать очищенный аудио-файл и паттерн для него.

Параметры восстановления:
- Уровень шума - указывает, насколько громким будет фоновый шум в местах пауз
- Множитель частоты дискретизации - параметр тона звука, попробуйте :)

После подбора необходимых параметров результат можно прослушать. Результат последствии можно сохранить на компьютер.

Особенности: 
- Динамическое изменение результата
- Вычисление алгоритма VAD в отдельном потоке
- Анимация процесса вычисления
- Воспроизведение результата в реальном времени


# Voice Activity Detection 

For the program to work, you need an audio file in Waveform Audio File Format (WAV). The following requirements apply to the file:
- Sampling rate: 8000 Hz
- Number of channels: 1 (mono)
### The program may not work correctly with files that differ from the requirements!
First, the program prompts you to select an audio file. You can use Drag and Drop and drag the selected audio file. If necessary, you can use the explorer. You can cancel the file selection using the appropriate button.

After selecting the file, you will be redirected to the main window of the program. The program window consists of:
- A field with file characteristics
- Audio waveform with speech/pause selection
- Action buttons

Algorithm Parameters:
- Window size - the size of the sections, but which the audio file will be split
- Coefficient k is the parameter of the "aggressiveness" of the algorithm

After selecting the necessary parameters, you can listen to the result with or without pauses. The "Play without pauses" checkbox is responsible for this functionality. After configuring the algorithm, you can download the cleaned audio file and the pattern for it.

Recovery Options:
- Noise level - indicates how loud the background noise will be in the pauses
- Sample rate multiplier - sound tone parameter, try it :)

After selecting the necessary parameters, you can listen to the result. The result can then be saved to your computer.

Features:
- Dynamic change of the result
- Calculation of the VAD algorithm in a separate thread
- Animation of the calculation process
- Real-time playback of the result




