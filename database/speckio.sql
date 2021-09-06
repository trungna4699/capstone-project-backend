# Uncomment below if database needs to be reset and run.
# DROP DATABASE Speckio; 

CREATE DATABASE Speckio;

USE Speckio;

CREATE TABLE Speckio.Tiers (
	tierID int NOT NULL auto_increment,
    tierName nvarchar(50) NOT NULL,
    licenseLimit int NOT NULL,
    PRIMARY KEY (tierID)
);

CREATE TABLE Speckio.Organisations (
	orgID int NOT NULL auto_increment,
    orgName nvarchar(255) NOT NULL,
    tierID int NOT NULL,
    isActive BOOLEAN NOT NULL,
    PRIMARY KEY (orgID),
    FOREIGN KEY (tierID) REFERENCES Speckio.Tiers(tierID)
);

CREATE TABLE Speckio.Users (
	userID int NOT NULL auto_increment,
	firstName nvarchar(50) NOT NULL,
	lastName nvarchar(50) NOT NULL,
	email nvarchar(50) NOT NULL,
	password nvarchar(255) NOT NULL,
	orgID int NOT NULL,
    isRegistered boolean NOT NULL,
	PRIMARY KEY (userID)
);

CREATE TABLE Speckio.Admins (
	orgID int NOT NULL,
    userID int NOT NULL,
    PRIMARY KEY (orgID, userID),
    FOREIGN KEY (orgID) REFERENCES Speckio.Organisations(orgID),
    FOREIGN KEY (userID) REFERENCES Speckio.Users(userID)
);

CREATE TABLE Speckio.Invites (
	token nvarchar(50) NOT NULL,
    email nvarchar(50) NOT NULL,
    orgID int NOT NULL,
    PRIMARY KEY (token),
    FOREIGN KEY (orgID) REFERENCES Speckio.Organisations(orgID)
);

CREATE TABLE Speckio.Teams (
	teamID int NOT NULL auto_increment,
	teamName nvarchar(50),
	teamLeaderID int,
	teamDescription nvarchar(255),
	PRIMARY KEY (teamID),
	FOREIGN KEY (teamLeaderID) REFERENCES Speckio.Users(userID)
);

CREATE TABLE Speckio.TeamMembers (
	teamID int NOT NULL,
	userID int NOT NULL,
    hasAccepted boolean,
	PRIMARY KEY (teamID, userID),
	FOREIGN KEY (teamID) REFERENCES Speckio.Teams(teamID),
	FOREIGN KEY (userID) REFERENCES Speckio.Users(userID)
);

CREATE TABLE Speckio.EQiDescriptions (
	descID int NOT NULL,
	descName nvarchar(255) NOT NULL,
	behaviour text NOT NULL,
	motivators text NOT NULL,
	strengths text NOT NULL,
	weaknesses text NOT NULL,
	reaction text NOT NULL,
	communication text NOT NULL,
	PRIMARY KEY (descID)
);

CREATE TABLE Speckio.EQiCategories (
	categoryID int NOT NULL,
	categoryName nvarchar(50) NOT NULL,
	lowID int,
	midID int,
	highID int,
	PRIMARY KEY (categoryID),
	FOREIGN KEY (lowID) REFERENCES Speckio.EQiDescriptions(descID),
	FOREIGN KEY (midID) REFERENCES Speckio.EQiDescriptions(descID),
	FOREIGN KEY (highID) REFERENCES Speckio.EQiDescriptions(descID)
);

CREATE TABLE Speckio.EQiResults (
	userID int NOT NULL,
	categoryID int NOT NULL,
	descID int NOT NULL,
	score int NOT NULL,
	PRIMARY KEY (userID, categoryID),
	FOREIGN KEY (userID) REFERENCES Speckio.Users(userID),
	FOREIGN KEY (categoryID) REFERENCES Speckio.EQiCategories(categoryID),
	FOREIGN KEY (descID) REFERENCES Speckio.EQiDescriptions(descID)
);

CREATE TABLE Speckio.MyerBriggsTypes (
	typeID int NOT NULL,
	typeName nvarchar(50) NOT NULL,
	behaviour nvarchar(255) NOT NULL,
	movitators nvarchar(255) NOT NULL,
	strengths nvarchar(255) NOT NULL,
	weaknesses nvarchar(255) NOT NULL,
	reaction nvarchar(255) NOT NULL,
	communication nvarchar(255) NOT NULL,
	PRIMARY KEY (typeID)
);

CREATE TABLE Speckio.MyerBriggsResults (
	userID int NOT NULL,
	typeID int NOT NULL,
	PRIMARY KEY (userID, typeID),
	FOREIGN KEY (userID) REFERENCES Speckio.Users(userID),
	FOREIGN KEY (typeID) REFERENCES Speckio.MyerBriggsTypes(typeID)
);

CREATE TABLE Speckio.DiscTypes (
	typeID int NOT NULL,
	typeName nvarchar(50) NOT NULL,
	behaviour nvarchar(255) NOT NULL,
	motivators nvarchar(255) NOT NULL,
	strengths nvarchar(255) NOT NULL,
	weaknesses nvarchar(255) NOT NULL,
	reaction nvarchar(255) NOT NULL,
	communication nvarchar(255) NOT NULL,
	PRIMARY KEY (typeID)
);

CREATE TABLE Speckio.DiscResults (
	userID int NOT NULL,
	typeID int NOT NULL,
	PRIMARY KEY (userID, typeID),
	FOREIGN KEY (userID) REFERENCES Speckio.Users(userID),
	FOREIGN KEY (typeID) REFERENCES Speckio.DiscTypes(typeID)
);

# Note, some of the EQi descriptions are place holders and will need to be updated
INSERT INTO Speckio.EQiDescriptions
VALUES
	(1,"Low Self-Regard","Struggle to confidently express yourself when working with others. Tend to avoid interactions where you are less confident or use email to avoid face to face conversations. Lower self-confidence, uncertain of abilities.","Lower motivation to achieve full potential.","Less positive outlook on strenghts & development areas","When presenting yourself, may use uncertain language, shy posture, avoid eye contact. ","May feel less capable than colleagues. ","Low Self-Regard Communication"),
	(2,"Mid Self-Regard","Confidence in self, respect self, understand own strengths & weaknesses & are comfortable with them, have a sense of self worth. ","Mid Self-Regard Motivators","Accept self (strengths & weaknesses). ","Mid Self-Regard Weaknesses","Confidence to state your view. Confidence to call out a team member's behaviour. If you have higher self regard, you have less self doubt.","Mid Self-Regard Communication"),
	(3,"High Self-Regard","Arrogant, over confident.","High Self-Regard Motivators","High Self-Regard Strengths","High Self-Regard Weaknesses","High Self-Regard Reaction Modes","High Self-Regard Communication"),
	(4,"Low Self-Actualisation","May not leverage your personal strengths & appear to be disengaged & acting without a plan.   ","Unlikely to set goals, may not make good use of strengths.","Low Self-Actualisation Strengths","Seen as lacking drive or vision to achieve something greater."," May accomplish performance objectives, however rarely set sights higher than the minimum required.","Low Self-Actualisation Communication"),
	(5,"Mid Self-Actualisation","You feel you have meaning & purpose in your life. Persistently trying to do your best & improve yourself in general.","Top of Maslow's Hierachy of Needs. You have an achievement drive.","You feel like you're fulfilling your potential.","Mid Self-Actualisation Weaknesses","Pursue opportunities for self improvement. Action orientated goals.","Mid Self-Actualisation Communication"),
	(6,"High Self-Actualisation","Overly ambitious, overly knowledgeable","High Self-Actualisation Motivators","High Self-Actualisation Strengths","High Self-Actualisation Weaknesses","High Self-Actualisation Reaction Modes","High Self-Actualisation Communication"),
	(7,"Low Emotional Self-Awareness","May be uncomfortable experiencing some emotions & don't notice the impact your emotions have on others. Experience of emotions may be black & white (you are angry or you are not), so to others your emotions may seem heightened or exaggerated.  Low awareness of inner thoughts & how others perceive them.","What you don't recognise, you can't manage - pay attention to how you are feeling. Improving the interplay between ESA, RT, EE, ST.","Low Emotional Self-Awareness Strengths","Emotions & their causes may be a challenge. ","ESA lower than Stress Tolerance - in times of stress your mood may impact your performance & that of your team mates.","Low Emotional Self-Awareness Communication"),
	(8,"Mid Emotional Self-Awareness"," You understand how you are you feeling and why. Able to recognise & regulate own emotional state and how it is impacting others, also able to recognise how other people's emotional states impact us.","Mid Emotional Self-Awareness Motivators","If you have a solid understanding of what causes your emotions (angry, frustration, surprise, happiness, tired, discouraged) it is easier to regulate your behaviour & control the impact your emotions have on those you work with.","Mid Emotional Self-Awareness Weaknesses","ESA is the cornerstone of EI & if it's not strong then there's a reason. There's something that's not allowing you to have the ability to reflect on your own emotional state.  We all have times when we're not aware of our emotions and the impact it's having because we're so consumed by what's going on in our heads that we're not at our best.  ","Mid Emotional Self-Awareness Communication"),
	(9,"High Emotional Self-Awareness","Hyper awareness of feelings, over analysis.","High Emotional Self-Awareness Motivators","High Emotional Self-Awareness Strengths","High Emotional Self-Awareness Weaknesses","High Emotional Self-Awareness Reaction Modes","High Emotional Self-Awareness Communication"),
	(10,"Low Emotional Expression","Assume people know how you feel so you don't display it through your words or actions. Uncomfortable expressing emotions through words, facial expressions, body language.  If you don't express emotions, others may feel uncomfortable being open & honest with you. Uncomfortable expressing self, may appear withdrawn, hard to read.","Less expressive style may mean that in new environments you could struggle to engage others, poker faced.","Low Emotional Expression Strengths"," Bottle up emotions inside & not share with others.","May not adequately explain the why behind decisions. EE lower than E - balancing the extent to which you empathise with others & express your own emotions, creates a better two way channel for communication of thoughts  & feelings.","Low Emotional Expression Communication"),
	(11,"Mid Emotional Expression","Ability to share emotions appropriately, your body language & what you say are congruent.","Authentic leadership.","Able to gain buy in as explain the why not just the how.","Mid Emotional Expression Weaknesses","Able to show vulnerability so people can connect with you. Share emotions (body language, tone) ","Mid Emotional Expression Communication"),
	(12,"High Emotional Expression","Share too much, melodramatic.","High Emotional Expression Motivators","High Emotional Expression Strengths","High Emotional Expression Weaknesses","All about the drama.","High Emotional Expression Communication"),
	(13,"Low Asertiveness","Keep thoughts & feelings to yourself, play the observer in meetings & discussions, you have a lot ot contribute but feel defeated when no one hears your good ideas, you work harder than most because you struggle to clearly articulate to others what you need.  Prevents you from motivating others to achieve indiviudal & team goals, effectively deal with conflict, could be seen as lacking initiative (particularly if low in independence). Passive, low conviction.","Impact at work - frustrustrated, unvoiced opinions, co worker takes credit for your work - it's if all this occurred without your approval or your input & you are left wanting to say so much more.","Low Asertiveness Strengths","Act passively, difficulty communicating feelings, beliefs & thoughts openly.","A is lower than E - place greater empahsis on caring for others. Can be assertive & empathic at the same time - being sensitve to the feelings of others allows you to express yourself a in a way that will be received in the best manner possible.","Low Asertiveness Communication"),
	(14,"Mid Asertiveness","Able to get what you need in a way that's not aggressive or defensive, state your point of view even when it's challenging to do so.","Mid Asertiveness Motivators","Mid Asertiveness Strengths","Mid Asertiveness Weaknesses","Mid Asertiveness Reaction Modes","Mid Asertiveness Communication"),
	(15,"High Asertiveness","Directive, bossy.","High Asertiveness Motivators","High Asertiveness Strengths","High Asertiveness Weaknesses","Appear directive in communication style.","High Asertiveness Communication"),
	(16,"Low Independence","Follower, relies on others to make decisions.","Low Independence Motivators","Low Independence Strengths","Low Independence Weaknesses","Low Independence Reaction Modes","Low Independence Communication"),
	(17,"Mid Independence","Shows you are usually willing & capable of choosing your own course of action. Sometimes welcome guidance or reassurance from others. Consult others for advice, but usually make the ultimate decision. Accept responsibility for your decisions, knowing that at times people will disagree with you.  Also have the ability to remain self directed & free from emotional dependency.  This is primarily about your level of emotional dependence/independence.","Comfortable being a leader & a follower. ","Having the right amount of emotional self reliance (not too distant and not too clingy).","Mid Independence Weaknesses","I is higher than PS  - balance by acting collaboratively when problem solving. Leverage IR skills & involve others in the decision making process.","Mid Independence Communication"),
	(18,"High Independence","Loner, don't enjoy being told what to do, not a team player.","High Independence Motivators","High Independence Strengths","High Independence Weaknesses","High Independence Reaction Modes","High Independence Communication"),
	(19,"Low Interpersonal Relationships"," Most of the time you need to get work done through others & if you are not easy to approach, it is likely that others avoid sharing information with you or feel little commitment to fulfilling their part of your shared objective. Hard to read, uncomfortable sharing, less trusting.","Low Interpersonal Relationships Motivators","Low Interpersonal Relationships Strengths","Transactional, how can others help you, rather than building bonds that include mutual give & take, rely on your own devices to get the job done, rather than asking for help.","IR lower than I - balance of doing things on your own & working with others. There are situations where collaboration can be advantageous.","Low Interpersonal Relationships Communication"),
	(20,"Mid Interpersonal Relationships","Ability and desire to develop mutually beneficial relationships in a work setting, friencly & able to connect with people.","Mid Interpersonal Relationships Motivators","Mid Interpersonal Relationships Strengths","Mid Interpersonal Relationships Weaknesses","Mid Interpersonal Relationships Reaction Modes","Mid Interpersonal Relationships Communication"),
	(21,"High Interpersonal Relationships","Can't work on their own, share too much.","High Interpersonal Relationships Motivators","High Interpersonal Relationships Strengths","High Interpersonal Relationships Weaknesses","Place more importance on preserving the relationship.","High Interpersonal Relationships Communication"),
	(22,"Low Empathy","Struggle to understand how others feel or recognise impact on others.","Low Empathy Motivators","Low Empathy Strengths","Low Empathy Weaknesses","Low Empathy Reaction Modes","Low Empathy Communication"),
	(23,"Mid Empathy","You are tuned in to how others are feeling, care about others, take others feelings in consideration before acting. Being able to see another person's point of view, people feel understood, easy for some people & for others it's almost impossible.  This is about stepping into another's model of the world - which is critical for influence. ","Very important leadership competency in today's environment.","Well developed, empathic towards others, respectiving their ideas even when they differ from your own.","Mid Empathy Weaknesses","Mid Empathy Reaction Modes","Mid Empathy Communication"),
	(24,"High Empathy","Can be a double edged sword - take on their problems, sympathy. Too much empasis on others' feelings in consideration before acting. ","High Empathy Motivators","High Empathy Strengths","Overly self sacrificing, never does things for self.","E higher than EE - taking other people's feelings into account when expressing your own emotions. Goal is to express your feelings effectively while staying attuned to others so that your expressions are more than just a reflection of the feelings of others.","High Empathy Communication"),
	(25,"Low Social Responsibility","More competitive than collaborative, more individualistic than collectivisit.","Low Social Responsibility Motivators","Low Social Responsibility Strengths","If low on this it just means you may be more self focussed at the moment.","Low Social Responsibility Reaction Modes","Low Social Responsibility Communication"),
	(26,"Mid Social Responsibility","Moral compass directing your behaviour toward promoting the greater good & contributing to society. Socially conscious & concerned with others well-being, identify with & see yourself as part of your team, feel a sense of fulfilment from helping others. ","Contributing member to the groups to which you belong. ","Mid Social Responsibility Strengths","Mid Social Responsibility Weaknesses"," Sense of community, may feel passionate about being on a crusade, having a social conscience.","Mid Social Responsibility Communication"),
	(27,"High Social Responsibility","Hyper-ethical.","High Social Responsibility Motivators","High Social Responsibility Strengths","High Social Responsibility Weaknesses","High Social Responsibility Reaction Modes","High Social Responsibility Communication"),
	(28,"Low Problem Solving","May prefer others to make decisions for you, struggle to keep a clear focus on the problem at hand, time & energy is spent worrying about decisions rather than trying to solve them, feel as if you have little control over the outcome. ","Tend to worry, feel overwhelmed, avoid solving the problem.","Low Problem Solving Strengths"," Anxious or unable to get past emotions involved in problems.","PS lower than F - consider alternate solutions, remain open to changing when requried, but doing so tto frequently can be inefficient & create confusion for those around you.","Low Problem Solving Communication"),
	(29,"Mid Problem Solving","Ability to find a solution & being able to park your emotions to do so (not allowing yourself to be emotionally compromised), ability to have rational conversations in your head & step outside of your emotions.","Mid Problem Solving Motivators","Mid Problem Solving Strengths","Mid Problem Solving Weaknesses","Find solutions without emotions impacting decision.","Mid Problem Solving Communication"),
	(30,"High Problem Solving","Hyper-rational","High Problem Solving Motivators","High Problem Solving Strengths","High Problem Solving Weaknesses","High Problem Solving Reaction Modes","High Problem Solving Communication"),
	(31,"Low Reality Testing","Have difficulty reading the play, set unrealistic goals.","Low Reality Testing Motivators","Low Reality Testing Strengths","Low Reality Testing Weaknesses","Have difficulty reading the play.","Low Reality Testing Communication"),
	(32,"Mid Reality Testing","Others seek your evaluation of a situation as you are able to remain objective even when emotions are heightened. Being able to read the play, read the situation without emotional biases,  able to step outside of yourself to do so.","Ability to size up the immediate situation - emotional responses are within reason & acceptable. ","Able to read people & situations & what needs to happen next","Mid Reality Testing Weaknesses","RT higher than PS - being grounded, involve integrating objective information with people factors, negotiating & managing emotional responses & taking action when needed.","Mid Reality Testing Communication"),
	(33,"High Reality Testing","Cynical, pessimist, black & white","High Reality Testing Motivators","High Reality Testing Strengths","High Reality Testing Weaknesses","High Reality Testing Reaction Modes","High Reality Testing Communication"),
	(34,"Low Impulse Control","Impulsive, impatient, over-reactive","Low Impulse Control Motivators","Low Impulse Control Strengths","Low Impulse Control Weaknesses","Low Impulse Control Reaction Modes","Low Impulse Control Communication"),
	(35,"Mid Impulse Control","Understanding appropriate times & ways to act on emotions & impulses, thinking before acting. Co workers feel they can predict your behaviour & provide open communication channels.  Level of patience & tolerance (conservative - hold back vs can't help but let out your opinion). ","Considerate, ensuring everyone has a chance to speak."," Stable nature can put people at ease.","Mid Impulse Control Weaknesses","IC is higher than A - work best together when A is tempered by good impulse control, resulting in communication that is both forthright & respectful. This means taking time to consider the impact of your actions, then proceeding with confidence in an appropriately assertive manner that reflects the situation.","Mid Impulse Control Communication"),
	(36,"High Impulse Control","Slow to react, aloof","High Impulse Control Motivators","High Impulse Control Strengths","High Impulse Control Weaknesses","High Impulse Control Reaction Modes","High Impulse Control Communication"),
	(37,"Low Flexibility","Values tradition, rigid view of the world, uneasy with change.","Low Flexibility Motivators","Low Flexibility Strengths","Low Flexibility Weaknesses","Low Flexibility Reaction Modes","Low Flexibility Communication"),
	(38,"Mid Flexibility","Adapting comes easily to you. Flexibility requries that you are able to modify your thoughts & behaviours in response to change. ","Adaptability, open to changing your perspective","Mid Flexibility Strengths"," Be careful that you don't appear so flexible that efforts appear scattered. ","See the end game & open to changing your mind.","Mid Flexibility Communication"),
	(39,"High Flexibility","Change preceded by reason & foresight is welcomed, particularly by those who are not as flexible as you are. You may have to alter the way you promote change to help people who struggle with the emotional adjustment change requires.","You may be seen a change leader","High Flexibility Strengths"," Scattered, easily swayed.","High Flexibility Reaction Modes","High Flexibility Communication"),
	(40,"Low Stress Tolerance","Less tolerant of stress, emotions may get in the way of coping.","Low Stress Tolerance Motivators","Low Stress Tolerance Strengths","Low Stress Tolerance Weaknesses","Low Stress Tolerance Reaction Modes","Low Stress Tolerance Communication"),
	(41,"Mid Stress Tolerance","You can maintain a level of work performance even under mounting pressure or competition, you actively cope with stress without letting your emotions take over.  Ability to stay calm & feel in control. ","Your ability to openly cope with your challenges & even bring others along with you is a sign of tenacious leadership, a quality that is imperative given the full schedules we all work with. ","Ability to tolerate stress & exert some influence over the situation is likely to appear calming.","Mid Stress Tolerance Weaknesses","ST is lower than F - aligning ST with F - enables you to recognise whether change or maintaining the status quo is the most effective course of action. When stressed, make sure various coping methords have been considered.","Mid Stress Tolerance Communication"),
	(42,"High Stress Tolerance","Lack of urgency, too relaxed.","High Stress Tolerance Motivators","High Stress Tolerance Strengths","High Stress Tolerance Weaknesses","High Stress Tolerance Reaction Modes","High Stress Tolerance Communication"),
	(43,"Low Optimism","Hold cynical view of the world, expects and plans for the worst.","Low Optimism Motivators","Low Optimism Strengths","Low Optimism Weaknesses","Low Optimism Reaction Modes","Low Optimism Communication"),
	(44,"Mid Optimism","Prefer to see the world in a positive light. Not so overly optimistic that you are blind or na�ve to the realities of life.  Others will see you as a hopeful vision of the future, with realistic plans.  ","Glass half full approach, hopeful about the future, overcome challenges, setbacks & obstacles.","Hopefulness & resilience are attributes of effective leaders.","Mid Optimism Weaknesses","Glass half full, seeing the opportunitines in the world rather than focussing on or being consumed by the problems.","Mid Optimism Communication"),
	(45,"High Optimism","Pollyanna, unrealistic.","High Optimism Motivators","High Optimism Strengths","High Optimism Weaknesses","High Optimism Reaction Modes","High Optimism Communication");
    
INSERT INTO Speckio.EQiCategories
VALUES
	(1,'Self-Regard',1,2,3),
	(2,'Self-Actualisation',4,5,6),
	(3,'Emotional Self-Awareness',7,8,9),
	(4,'Emotional Expression',10,11,12),
	(5,'Asertiveness',13,14,15),
	(6,'Independence',16,17,18),
	(7,'Interpersonal Relationships',19,20,21),
	(8,'Empathy',22,23,24),
	(9,'Social Responsibility',25,26,27),
	(10,'Problem Solving',28,29,30),
	(11,'Reality Testing',31,32,33),
	(12,'Impulse Control',34,35,36),
	(13,'Flexibility',37,38,39),
	(14,'Stress Tolerance',40,41,42),
	(15,'Optimism',43,44,45);

# Note, all of the DiSC descriptions are place holders and will need to be updated.
INSERT INTO Speckio.DiscTypes
VALUES
	(1,'Dominance C','Dominance C Behavioural Insights','Dominance C Motivators','Dominance C Strengths','Dominance C Weaknesses','Dominance C Reaction Modes','Dominance C Communication'),
	(2,'Dominance','Dominance  Behavioural Insights','Dominance  Motivators','Dominance  Strengths','Dominance  Weaknesses','Dominance  Reaction Modes','Dominance  Communication'),
	(3,'Dominance I','Dominance I Behavioural Insights','Dominance I Motivators','Dominance I Strengths','Dominance I Weaknesses','Dominance I Reaction Modes','Dominance I Communication'),
	(4,'Influence D','Influence D Behavioural Insights','Influence D Motivators','Influence D Strengths','Influence D Weaknesses','Influence D Reaction Modes','Influence D Communication'),
	(5,'Influence','Influence  Behavioural Insights','Influence  Motivators','Influence  Strengths','Influence  Weaknesses','Influence  Reaction Modes','Influence  Communication'),
	(6,'Influence S','Influence S Behavioural Insights','Influence S Motivators','Influence S Strengths','Influence S Weaknesses','Influence S Reaction Modes','Influence S Communication'),
	(7,'Steadiness I','Steadiness I Behavioural Insights','Steadiness I Motivators','Steadiness I Strengths','Steadiness I Weaknesses','Steadiness I Reaction Modes','Steadiness I Communication'),
	(8,'Steadiness','Steadiness  Behavioural Insights','Steadiness  Motivators','Steadiness  Strengths','Steadiness  Weaknesses','Steadiness  Reaction Modes','Steadiness  Communication'),
	(9,'Steadiness C','Steadiness C Behavioural Insights','Steadiness C Motivators','Steadiness C Strengths','Steadiness C Weaknesses','Steadiness C Reaction Modes','Steadiness C Communication'),
	(10,'Concientiousness S','Concientiousness S Behavioural Insights','Concientiousness S Motivators','Concientiousness S Strengths','Concientiousness S Weaknesses','Concientiousness S Reaction Modes','Concientiousness S Communication'),
	(11,'Concientiousness','Concientiousness  Behavioural Insights','Concientiousness  Motivators','Concientiousness  Strengths','Concientiousness  Weaknesses','Concientiousness  Reaction Modes','Concientiousness  Communication'),
	(12,'Concientiousness D','Concientiousness D Behavioural Insights','Concientiousness D Motivators','Concientiousness D Strengths','Concientiousness D Weaknesses','Concientiousness D Reaction Modes','Concientiousness D Communication');

INSERT INTO Speckio.Tiers(tierName, licenseLimit)
VALUES
	('Bronze', 50),
    ('Silver', 100),
    ('Gold', 250);