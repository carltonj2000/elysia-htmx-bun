CREATE TABLE IF NOT EXISTS habits (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  color TEXT NOT NULL
);

INSERT INTO habits (title, description, color) VALUES
  ('Meditation', 'Practice mindfulness and reduce stress.', '#008000'),
  ('Exercise', 'Stay active and improve physical health.', '#FF0000'),
  ('Healthy Eating', 'Make nutritious choices and fuel your body.', '#00FF00'),
  ('Reading', 'Expand knowledge and stimulate the mind.', '#FFFF00'),
  ('Journaling', 'Reflect on experiences and express thoughts.', '#0000FF'),
  ('Learning a new skill', 'Challenge yourself and broaden your horizons.', '#FF00FF'),
  ('Spending time with loved ones', 'Nurture relationships and build connections.', '#800080'),
  ('Getting enough sleep', 'Rest and recharge for optimal functioning.', '#C0C0C0'),
  ('Volunteering', 'Give back to the community and make a difference.', '#00FFFF'),
  ('Practicing gratitude', 'Appreciate the good things in life and cultivate happiness.', '#FF8000');
