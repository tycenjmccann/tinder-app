import Foundation

@MainActor
class FlashcardSessionViewModel: ObservableObject {
    @Published var currentCardIndex = 0
    @Published var isFlipped = false
    @Published var cards: [Flashcard] = []
    @Published var correctCards: Set<UUID> = []
    @Published var seenCards: Set<UUID> = []

    private let topic: Topic
    private let progressManager = ProgressManager()
    private let isQuickSession: Bool

    var currentCard: Flashcard? {
        guard currentCardIndex < cards.count else { return nil }
        return cards[currentCardIndex]
    }

    var progress: Double {
        guard !cards.isEmpty else { return 0 }
        return Double(currentCardIndex + 1) / Double(cards.count)
    }

    var isLastCard: Bool {
        currentCardIndex >= cards.count - 1
    }

    init(topic: Topic, isQuickSession: Bool = false) {
        self.topic = topic
        self.isQuickSession = isQuickSession
        Task { await loadCards() }
    }

    private func loadCards() async {
        guard let deck = await S3ContentLoader.shared.load(
            FlashcardDeck.self,
            s3Key: "flashcards/\(topic.fileName).json",
            bundleName: topic.fileName
        ) else { return }

        if isQuickSession {
            cards = Array(deck.cards.shuffled().prefix(10))
        } else {
            cards = deck.cards
        }
    }

    func flipCard() {
        isFlipped.toggle()
        if let card = currentCard {
            seenCards.insert(card.id)
        }
    }

    func markAsCorrect() {
        guard let card = currentCard else { return }
        correctCards.insert(card.id)
        seenCards.insert(card.id)
        nextCard()
    }

    func markAsIncorrect() {
        guard let card = currentCard else { return }
        seenCards.insert(card.id)
        nextCard()
    }

    private func nextCard() {
        if currentCardIndex < cards.count - 1 {
            currentCardIndex += 1
            isFlipped = false
        }
    }

    func saveProgress() {
        progressManager.updateProgress(
            topicId: topic.fileName,
            cardsSeen: seenCards.count,
            cardsCorrect: correctCards.count
        )
        DailyMetricsManager.shared.recordCardCompleted()
    }
}
