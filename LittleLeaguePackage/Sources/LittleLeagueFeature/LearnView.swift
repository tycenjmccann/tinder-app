import SwiftUI

struct LearnView: View {
    @StateObject private var viewModel = LearnViewModel()
    @StateObject private var subscriptionManager = SubscriptionManager.shared
    @StateObject private var dailyMetrics = DailyMetricsManager()
    @State private var showQuickSession = false
    @State private var showPaywall = false

    // Free sample deck — 16 hand-picked cards across all personas
    private static let freeDeckName = "free_sample"

    var body: some View {
        NavigationView {
            List {
                SwiftUI.Section {
                    ProgressMetricsCard(metrics: dailyMetrics)
                        .listRowInsets(EdgeInsets(top: 8, leading: 0, bottom: 8, trailing: 0))
                        .listRowBackground(Color.clear)
                        .listRowSeparator(.hidden)
                }

                SwiftUI.Section {
                    Button {
                        if subscriptionManager.isSubscribed {
                            showQuickSession = true
                        } else {
                            showPaywall = true
                        }
                    } label: {
                        HStack {
                            Label("Quick Session — 10 Random Cards", systemImage: "shuffle")
                                .font(.headline)
                            if !subscriptionManager.isSubscribed {
                                Spacer()
                                Image(systemName: "lock.fill")
                                    .font(.subheadline)
                            }
                        }
                        .foregroundColor(.white)
                        .padding(.horizontal, 16)
                        .frame(maxWidth: .infinity, minHeight: 60)
                        .background(subscriptionManager.isSubscribed ? Color.blue : Color.gray)
                        .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
                        .accessibilityIdentifier("QuickSessionButton")
                    }
                    .listRowInsets(EdgeInsets(top: 4, leading: 0, bottom: 4, trailing: 0))
                    .listRowBackground(Color.clear)
                    .listRowSeparator(.hidden)
                    .background(
                        NavigationLink(destination: QuickSessionView(), isActive: $showQuickSession) { EmptyView() }
                            .hidden()
                    )
                } header: {
                    Text("Quick Start")
                }

                // Free preview section — always visible
                if let freeTopic = viewModel.topics.first(where: { $0.fileName == Self.freeDeckName }) {
                    SwiftUI.Section(header: Text("Free Preview")) {
                        NavigationLink(destination: FlashcardSessionView(topic: freeTopic)) {
                            TopicRowView(topic: freeTopic)
                        }
                        .accessibilityLabel("Sample flash cards, \(freeTopic.cardCount) cards")
                    }
                }

                SwiftUI.Section(header: Text("Topics")) {
                    ForEach(viewModel.topics.filter { $0.fileName != Self.freeDeckName }) { topic in
                        let isUnlocked = subscriptionManager.isSubscribed

                        if isUnlocked {
                            NavigationLink(destination: FlashcardSessionView(topic: topic)) {
                                TopicRowView(topic: topic)
                            }
                            .accessibilityLabel("\(topic.name), \(topic.cardCount) cards")
                            .accessibilityHint("Tap to start flashcard session")
                        } else {
                            Button {
                                showPaywall = true
                            } label: {
                                HStack {
                                    TopicRowView(topic: topic)
                                    Image(systemName: "lock.fill")
                                        .foregroundColor(.secondary)
                                        .font(.caption)
                                }
                                .opacity(0.6)
                            }
                            .accessibilityLabel("\(topic.name), \(topic.cardCount) cards, locked")
                            .accessibilityHint("Subscribe to unlock this topic")
                        }
                    }
                }
            }
            .navigationTitle("Flash Cards")
            .refreshable {
                viewModel.refreshTopics()
            }
            .accessibilityIdentifier("LearnScrollView")
            .sheet(isPresented: $showPaywall) {
                PaywallView(subscriptionManager: subscriptionManager)
            }
        }
    }
}

struct QuickSessionView: View {
    @StateObject private var viewModel = LearnViewModel()
    @State private var selectedTopic: Topic?

    var body: some View {
        if let topic = selectedTopic {
            FlashcardSessionView(topic: topic, isQuickSession: true)
        } else {
            VStack {
                Text("Starting Quick Session...")
                    .font(.headline)
                ProgressView()
            }
            .onChange(of: viewModel.isLoading) { _, isLoading in
                if !isLoading, selectedTopic == nil, let topic = viewModel.topics.randomElement() {
                    selectedTopic = topic
                }
            }
        }
    }
}

struct TopicRowView: View {
    let topic: Topic

    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text(topic.name)
                    .font(.body)

                Text("\(topic.cardCount) cards")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            Spacer()

            VStack(alignment: .trailing, spacing: 4) {
                Text("\(Int(topic.completionPercentage))%")
                    .font(.caption)
                    .foregroundColor(.secondary)

                ProgressView(value: topic.completionPercentage, total: 100)
                    .frame(width: 60)
                    .accessibilityLabel("Progress: \(Int(topic.completionPercentage)) percent complete")
            }
        }
        .padding(.vertical, 4)
    }
}
